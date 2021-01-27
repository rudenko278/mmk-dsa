import { SyntheticEvent, useCallback } from 'react';
import {
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from '@material-ui/core';
import api from '../../../api';
import { useAppStore } from '../../../store';
import { AppButton, AppIconButton, AppLink } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../../utils/form';
import { useState } from 'react';
import { useEffect } from 'react';

const VALIDATE_FORM_SIGNUP = {
  nameFirst: {
    type: 'string',
  },
  nameLast: {
    type: 'string',
  },
  email: {
    presence: true,
    email: true,
  },
  phone: {
    presence: true,
    format: {
      pattern: '[- .+()0-9]+',
      // flags: "i",
      message: 'should contain numbers',
    },
  },
  password: {
    presence: true,
    length: {
      minimum: 8,
      maximum: 32,
      message: 'must be between 8 and 32 characters',
    },
  },
};

const VALIDATE_EXTENSION = {
  confirmPassword: {
    equality: 'password',
  },
};

interface FormStateValues {
  nameFirst?: string;
  nameLast?: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  otp?: string;
}

/**
 * Renders Signup Form view
 * url: /auth/signup/*
 */
const SignupView = () => {
  const [validationSchema, setValidationSchema] = useState<any>({
    ...VALIDATE_FORM_SIGNUP,
    ...VALIDATE_EXTENSION,
  });
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: validationSchema, // the state value, so could be changed in time
    initialValues: {
      nameFirst: '',
      nameLast: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    } as FormStateValues,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [, dispatch] = useAppStore();

  useEffect(() => {
    let newSchema;
    if (showPassword) {
      newSchema = VALIDATE_FORM_SIGNUP; // Validation without .confirmPassword
    } else {
      newSchema = { ...VALIDATE_FORM_SIGNUP, ...VALIDATE_EXTENSION }; // Full validation
    }
    setValidationSchema(newSchema);
  }, [showPassword]);

  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);

  const handleAgreeClick = useCallback(() => {
    setAgree((oldValue) => !oldValue);
  }, []);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      console.log('onSubmit() - formState.values:', formState.values);

      const result = await api.auth.signup(formState.values as FormStateValues);
      // console.warn('api.auth.signup() - result:', result);
      if (!result) return; // Unsuccessful signup

      dispatch({ type: 'SIGN_UP' });
    },
    [dispatch, formState.values]
  );

  return (
    <Grid container direction="column">
      <Grid item>
        <form onSubmit={handleFormSubmit}>
          <Card>
            <CardHeader title="Sign Up" />
            <CardContent>
              <TextField
                label="First Name"
                name="nameFirst"
                value={(formState.values as FormStateValues).nameFirst}
                error={fieldHasError('nameFirst')}
                helperText={fieldGetError('nameFirst') || ' ' /*|| 'Enter your first name'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                label="Last Name"
                name="nameLast"
                value={(formState.values as FormStateValues).nameLast}
                error={fieldHasError('nameLast')}
                helperText={fieldGetError('nameLast') || ' ' /*|| 'Enter your last name'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                label="Phone"
                name="phone"
                value={(formState.values as FormStateValues).phone}
                error={fieldHasError('phone')}
                helperText={fieldGetError('phone') || ' ' /*|| 'Enter mobile phone number'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                label="Email"
                name="email"
                value={(formState.values as FormStateValues).email}
                error={fieldHasError('email')}
                helperText={fieldGetError('email') || ' ' /*|| 'Enter email address'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                type={showPassword ? 'text' : 'password'}
                label="Password"
                name="password"
                value={(formState.values as FormStateValues).password}
                error={fieldHasError('password')}
                helperText={fieldGetError('password') || ' ' /*|| 'Enter password'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AppIconButton
                        aria-label="toggle password visibility"
                        icon={showPassword ? 'visibilityon' : 'visibilityoff'}
                        onClick={handleShowPasswordClick}
                        onMouseDown={eventPreventDefault}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              {!showPassword && (
                <TextField
                  required
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  value={(formState.values as FormStateValues).confirmPassword}
                  error={fieldHasError('confirmPassword')}
                  helperText={fieldGetError('confirmPassword') || ' ' /*|| 'Re-enter password'*/}
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
                />
              )}
              <FormControlLabel
                control={<Checkbox required name="agree" checked={agree} onChange={handleAgreeClick} />}
                label={
                  <>
                    You must agree with <AppLink to="/legal/terms">Terms of Use</AppLink> and{' '}
                    <AppLink to="/legal/privacy">Privacy Policy</AppLink> to use our service
                  </>
                }
              />
              <Grid container justify="center" alignItems="center">
                <AppButton type="submit" disabled={!(formState.isValid && agree)}>
                  Confirm and Sign Up
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Grid>
    </Grid>
  );
};

export default SignupView;