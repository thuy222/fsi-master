import React, { useEffect } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import {
  AuthenticationLayout
} from '../layout/authentication-layout'
import {
  AUTH_PATH,
  REGISTER_PATH,
  NOT_FOUND_PATH,
  TRANSITION_PAGE_PATH,
  HOME_PATH,
  USER_PATH
} from './route.constant'
import { AuthenticationForm, RecoveryPassword, RegisterForm } from '../modules/auth/containers'
import AuthenticatedRoute from './AuthenticatedRoute'
import { Dashboard } from '../modules/dashboard/containers'
import {
  EmailDelivered,
  NotFoundPage,
  VerifyEmailTransition
} from '../modules/transition-pages/containers'

const Routers = () => {
  useEffect(() => {
    const firstLoader = document.getElementById('first-loader')
    firstLoader.remove()
  }, [])

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={[HOME_PATH]}>
          <AuthenticatedRoute>
            <Route
              component={(props) => (
                <AuthenticationLayout>
                  <Dashboard {...props} />
                </AuthenticationLayout>
              )}
              exact
              path={HOME_PATH}
            />
          </AuthenticatedRoute>
        </Route>
        <Route
          exact
          path={[
            REGISTER_PATH,
            AUTH_PATH.LOGIN,
            TRANSITION_PAGE_PATH.VERIFY_EMAIL,
            TRANSITION_PAGE_PATH.EMAIL_DELIVERED,
            USER_PATH.PASSWORD_RECOVERY
          ]}
        >
          <AuthenticationLayout>
            <Route
              component={AuthenticationForm}
              exact
              path={AUTH_PATH.LOGIN}
            />
            <Route
              component={RegisterForm}
              exact
              path={REGISTER_PATH}
            />
            <Route
              component={VerifyEmailTransition}
              exact
              path={TRANSITION_PAGE_PATH.VERIFY_EMAIL}
            />
            <Route
              component={EmailDelivered}
              exact
              path={TRANSITION_PAGE_PATH.EMAIL_DELIVERED}
            />
            <Route
              component={RecoveryPassword}
              exact
              path={USER_PATH.PASSWORD_RECOVERY}
            />
          </AuthenticationLayout>
        </Route>
        <Route component={NotFoundPage} exact path={NOT_FOUND_PATH} />
        <Redirect to={NOT_FOUND_PATH} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routers
