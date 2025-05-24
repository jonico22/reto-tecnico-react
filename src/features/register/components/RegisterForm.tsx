import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import {
  updateFormField as updateFormFieldAction, 
  submitRegisterAndUserDataToAPI,
  clearSubmissionError,
} from '../../../store/RegisterSlice'; 
import { RegisterFormSchema, RegisterFormErrors, RegisterFormData } from '../validation/registerFormValidation';
import Button from '../../../components/Button/Button';
import styles from './RegisterForm.module.css';

const RegisterFormComponent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    formData: storeFormData,
    isSubmittingForm,
    formSubmissionError,
    isSuccessfullySubmittedInitialForm,
  } = useSelector((state: RootState) => state.register);

  const [formValues, setFormValues] = useState<RegisterFormData>({
    documentType: storeFormData.documentType || 'dni',
    documentNumber: storeFormData.documentNumber || '',
    cellphone: storeFormData.cellphone || '',
    privacyPolicy: storeFormData.privacyPolicy === undefined ? true : storeFormData.privacyPolicy,
    commercialComms: storeFormData.commercialComms === undefined ? true : storeFormData.commercialComms,
  });
  const [zodErrors, setZodErrors] = useState<RegisterFormErrors>({});

  useEffect(() => {
    setFormValues({
      documentType: storeFormData.documentType || 'dni',
      documentNumber: storeFormData.documentNumber || '',
      cellphone: storeFormData.cellphone || '',
      privacyPolicy: storeFormData.privacyPolicy === undefined ? true : storeFormData.privacyPolicy,
      commercialComms: storeFormData.commercialComms === undefined ? true : storeFormData.commercialComms,
    });
  }, [storeFormData]);

  useEffect(() => {
    if (isSuccessfullySubmittedInitialForm) {
     navigate('/planes'); 
    }
  }, [isSuccessfullySubmittedInitialForm, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormValues((prev) => ({ ...prev, [name]: fieldValue }));
    dispatch(updateFormFieldAction({ field: name as keyof RegisterFormData, value: fieldValue }));

    if (zodErrors[name as keyof RegisterFormData]) {
      setZodErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (formSubmissionError) {
        dispatch(clearSubmissionError());
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setZodErrors({});
    if (formSubmissionError) dispatch(clearSubmissionError());

    const validationResult = RegisterFormSchema.safeParse(formValues);
    if (!validationResult.success) {
      const fieldErrors: RegisterFormErrors = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof RegisterFormData] = err.message;
        }
      });
      setZodErrors(fieldErrors);
      return;
    }

    dispatch(submitRegisterAndUserDataToAPI(validationResult.data));
    navigate('/planes');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      <div className={styles.formGroupInline}>
        <div className={`${styles.formGroup} ${styles.selectGroup} `}>
          <label htmlFor="document-type"  className="sr-only">Tipo de documento</label>

          <select
            id="document-type"
            name="documentType"
            value={formValues.documentType}
            onChange={handleChange}
            disabled={isSubmittingForm}
            aria-invalid={!!zodErrors.documentType}
            aria-describedby={zodErrors.documentType ? "documentType-error-zod" : undefined}
          >
            <option value="dni">DNI</option>
          </select>
          {zodErrors.documentType && <p id="documentType-error-zod" className={styles.errorMessage}>{zodErrors.documentType}</p>}
        </div>
        <div className={styles.formGroup + " " + styles.documentNumberGroup + " " + styles.materialGroup}>
          <input
            type="text"
            id="document-number"
            name="documentNumber"
            placeholder=" "
            value={formValues.documentNumber}
            onChange={handleChange}
            disabled={isSubmittingForm}
            maxLength={8}
            aria-invalid={!!zodErrors.documentNumber}
            aria-describedby={zodErrors.documentNumber ? "documentNumber-error-zod" : undefined}
            className={zodErrors.documentNumber ? styles.inputError : ""}
            autoComplete="off"
          />
            <label htmlFor="document-number" className={styles.materialLabel}>Nro. de documento</label>
              {zodErrors.documentNumber && (
                <p id="documentNumber-error-zod" className={styles.errorMessage}>
                  {zodErrors.documentNumber}
                </p>
              )}        
          </div>
      </div>
       <div className={styles.formGroup + " "  + styles.materialGroup}>
        <input type="tel" id="cellphone" name="cellphone"
         placeholder="" value={formValues.cellphone}
          onChange={handleChange} disabled={isSubmittingForm} 
          maxLength={9} autoComplete="off"
          aria-invalid={!!zodErrors.cellphone} />
        <label htmlFor="cellphone"  className={styles.materialLabel}>Celular</label>
        {zodErrors.cellphone && <p className={styles.errorMessage}>{zodErrors.cellphone}</p>}
      </div>

      <div className={styles.checkboxGroup}>
        <input type="checkbox" id="privacy-policy" name="privacyPolicy" checked={formValues.privacyPolicy} onChange={handleChange} disabled={isSubmittingForm} aria-invalid={!!zodErrors.privacyPolicy} />
        <label htmlFor="privacy-policy">Acepto la Política de Privacidad</label>
      </div>
      {zodErrors.privacyPolicy && <p className={styles.errorMessage + " " + styles.checkboxError}>{zodErrors.privacyPolicy}</p>}

      <div className={styles.checkboxGroup}>
        <input type="checkbox" id="commercial-comms" name="commercialComms" checked={formValues.commercialComms} onChange={handleChange} disabled={isSubmittingForm} aria-invalid={!!zodErrors.commercialComms} />
        <label htmlFor="commercial-comms">Acepto la Política Comunicaciones Comerciales</label>
      </div>
      {zodErrors.commercialComms && <p className={styles.errorMessage + " " + styles.checkboxError}>{zodErrors.commercialComms}</p>}
      {formSubmissionError && <p className={styles.apiErrorMessage}>{formSubmissionError}</p>}

      <a href="#" className={styles.termsLink}>Aplican Términos y Condiciones.</a>
      <Button type="submit" disabled={isSubmittingForm} fullWidth>
        {isSubmittingForm ? 'Enviando...' : 'Cotiza aquí'}
      </Button>
    </form>
  );
};

export default RegisterFormComponent;