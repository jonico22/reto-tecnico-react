import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RegisterFormData, UserServiceResponse } from '../features/register/types/register.types';
import { API_USER,API_PLANS } from '../constants'; 
export type QuoteTarget = 'me' | 'someoneElse' | null;

export interface Plan {
  id: string; 
  name: string;
  price: number;
  currency?: string; 
  description: string[];
  iconUrl?: string; 
  isRecommended?: boolean;
  age: number;
}

export interface QuoteState {
  formData: Partial<RegisterFormData>;
  isSubmittingForm: boolean; 
  formSubmissionError: string | null; 
  userServiceResponse: UserServiceResponse | null;
  isSuccessfullySubmittedInitialForm: boolean; 
  finalSubmittedQuoteData: RegisterFormData | null;
  name: null,
  lastName: null,
  birthDay: null,
  quoteForWhom: QuoteTarget, 
  availablePlans: Plan[];
  isLoadingPlans: boolean;
  plansError: string | null;
  selectedPlanId: string | null;
}


const initialFormData: Partial<RegisterFormData> = {
   documentType: 'dni',
};

const initialState: QuoteState = {
  formData: initialFormData,
  isSubmittingForm: false,
  formSubmissionError: null,
  userServiceResponse: null,
  isSuccessfullySubmittedInitialForm: false,
  finalSubmittedQuoteData: null,
  name: null, 
  lastName: null, 
  birthDay: null, 
  quoteForWhom: null, 
  availablePlans: [],
  isLoadingPlans: false,
  plansError: null,
  selectedPlanId: null,
};


export const submitRegisterAndUserDataToAPI = createAsyncThunk<{ serviceResponse: UserServiceResponse; quoteData: RegisterFormData }, 
  RegisterFormData,{ rejectValue: string }>
  ('api/user', async (quoteData, thunkAPI) => {
    try {
      const response = await fetch(API_USER, { 
        method: 'GET',
      });

      if (!response.ok) {
        let errorMessage = `Error del servidor: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) { console.error('Error al parsear la respuesta de error:', e); }
        return thunkAPI.rejectWithValue(errorMessage);
      }
      const serviceResponseData: UserServiceResponse = await response.json();
      return { serviceResponse: serviceResponseData, quoteData }; 
    } catch (error: unknown) {
      console.error('Error en thunk al enviar al servicio /user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error al procesar tu solicitud.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const [day, month, year] = birthDate.split('-').map(Number);
  const birthDateObj = new Date(year, month - 1, day); 
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) { 
    age--;
  }
  return age;
};

export const fetchAvailablePlans = createAsyncThunk<
  Plan[], 
  { target: QuoteTarget; dateBrithday?: string }, 
  { rejectValue: string }
>(
  'api/plans',
  async (params, thunkAPI) => {
    if (!params.target) {
      return thunkAPI.rejectWithValue('Debe seleccionar para quién es la cotización.');
    }
    try {
      
      const response = await fetch(API_PLANS, { 
        method: 'GET',
      });
      const serviceResponseData = await response.json();
      const listPlans: Plan[] = [];
      if (response.status !== 200) {
        let errorMessage = `Error del servidor: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) { console.error('Error al parsear la respuesta de error:', e); }
        return thunkAPI.rejectWithValue(errorMessage);
      }
      if (!serviceResponseData.list || serviceResponseData.list.length === 0) {
        return thunkAPI.rejectWithValue('No hay planes disponibles para la selección actual.');
      }
      if (params.dateBrithday) {
        console.log('edad', calculateAge(params.dateBrithday));
      }
      serviceResponseData.list = serviceResponseData.list.map((plan: Plan) => ({
        ...plan,
        isRecommended: plan.isRecommended || false,
        id : plan.id || `plan-${Math.random().toString(36).substr(2, 9)}`,
      }));

      serviceResponseData.list = serviceResponseData.list.filter((plan: Plan) => {
        if (!params.dateBrithday) return true;
        if (calculateAge(params.dateBrithday) <= plan.age) {
          listPlans.push(plan);
        }
      });
      return listPlans;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar los planes.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    updateFormField: (
      state,
      action: PayloadAction<{ field: keyof RegisterFormData; value: unknown }>
    ) => {
      // @ts-expect-error
      state.formData[action.payload.field] = action.payload.value;
    },
    setFormData: (state, action: PayloadAction<Partial<RegisterFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setQuoteForWhom: (state, action: PayloadAction<QuoteTarget>) => {
      state.quoteForWhom = action.payload;
      state.availablePlans = [];
      state.plansError = null;
      state.selectedPlanId = null;
      state.isLoadingPlans = false; 
    },
    resetRegisterState: (state) => {
      state.formData = initialFormData;
      state.isSubmittingForm = false;
      state.formSubmissionError = null;
      state.userServiceResponse = null;
      state.isSuccessfullySubmittedInitialForm = false;
      state.finalSubmittedQuoteData = null;
    },
    setSelectedPlanId: (state, action: PayloadAction<string | null>) => { 
      state.selectedPlanId = action.payload;
    },
    setLoadingPlan: (state, action: PayloadAction<boolean>) => {
      state.isLoadingPlans = action.payload;
    },
    resetQuoteState: (state) => {
      state.quoteForWhom = null;
      state.availablePlans = [];
      state.isLoadingPlans = false;
      state.plansError = null;
      state.selectedPlanId = null;
    },
    clearSubmissionError: (state) => {
        state.formSubmissionError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitRegisterAndUserDataToAPI.fulfilled, (state, action) => {
        state.isSubmittingForm = false;
        state.userServiceResponse = action.payload.serviceResponse;
        state.finalSubmittedQuoteData = action.payload.quoteData;
        state.isSuccessfullySubmittedInitialForm = true;
      })
      .addCase(submitRegisterAndUserDataToAPI.rejected, (state, action) => {
        state.isSubmittingForm = false;
        state.formSubmissionError = action.payload ?? 'Error desconocido.';
      });

    builder
      .addCase(fetchAvailablePlans.pending, (state) => {
        state.isLoadingPlans = true;
        state.plansError = null;
        state.availablePlans = []; 
        state.selectedPlanId = null; 
      })
      .addCase(fetchAvailablePlans.fulfilled, (state, action: PayloadAction<Plan[]>) => {
        state.isLoadingPlans = false;
        state.availablePlans = action.payload;
      })
      .addCase(fetchAvailablePlans.rejected, (state, action) => {
        state.isLoadingPlans = false;
        state.plansError = action.payload ?? 'Error al cargar planes.';
      });
  },

});

export const { updateFormField, setFormData, resetRegisterState, clearSubmissionError,setLoadingPlan,
  setQuoteForWhom,resetQuoteState,setSelectedPlanId } = registerSlice.actions;

export default registerSlice.reducer;