import React from 'react'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter, HashRouter, Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'

import { INITIAL_STATE, rootReducer } from 'apps/explorer/state'
import Console from 'Console'
import { withGlobalContext } from 'hooks/useGlobalState'
import useNetworkCheck from 'hooks/useNetworkCheck'

import { GenericLayout } from 'components/layout'
import { Header } from './layout/Header'

import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { initAnalytics } from 'api/analytics'
import NetworkAnalytics from 'components/analytics/NetworkAnalytics'
import RouteAnalytics from 'components/analytics/RouteAnalytics'
import { NetworkUpdater, RedirectBoba } from 'state/network'
import { environmentName } from 'utils/env'
import { version } from '../../../package.json'
import { DIMENSION_NAMES } from './const'
import { GlobalStyle, MainWrapper } from './styled'

const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN
const SENTRY_TRACES_SAMPLE_RATE = process.env.REACT_APP_SENTRY_TRACES_SAMPLE_RATE

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    release: 'momiji-explorer@v' + version,
    environment: environmentName,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE ? Number(SENTRY_TRACES_SAMPLE_RATE) : 1.0,
  })
}

// Init analytics
const GOOGLE_ANALYTICS_ID: string | undefined = process.env.GOOGLE_ANALYTICS_ID
initAnalytics({
  trackingCode: GOOGLE_ANALYTICS_ID,
  dimensionNames: DIMENSION_NAMES,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Router: typeof BrowserRouter & typeof HashRouter = (window as any).IS_IPFS ? HashRouter : BrowserRouter

const NotFound = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Extra_routes_chunk"*/
      './pages/NotFound'
    ),
)

const SearchNotFound = React.lazy(
  () =>
    import(
      /* webpackChunkName: "SearchNotFound_chunk"*/
      './pages/SearchNotFound'
    ),
)

const Home = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Trade_chunk"*/
      './pages/Home'
    ),
)

const Order = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Order_chunk"*/
      './pages/Order'
    ),
)

const UserDetails = React.lazy(
  () =>
    import(
      /* webpackChunkName: "UserDetails_chunk"*/
      './pages/UserDetails'
    ),
)

const TransactionDetails = React.lazy(
  () =>
    import(
      /* webpackChunkName: "TransactionDetails_chunk"*/
      './pages/TransactionDetails'
    ),
)

/**
 * Update the global state
 */
function StateUpdaters(): JSX.Element {
  return <NetworkUpdater />
}

const Analytics = (): JSX.Element => (
  <>
    <Route component={RouteAnalytics} />
    <Route component={NetworkAnalytics} />
  </>
)

/** App content */
const AppContent = (): JSX.Element => {
  const { path } = useRouteMatch()

  const pathPrefix = path == '/' ? '' : path

  return (
    <GenericLayout header={<Header />}>
      <React.Suspense fallback={null}>
        <Analytics />

        <Switch>
          <Route path={pathPrefix + '/'} exact component={Home} />
          <Route
            path={[pathPrefix + '/address/', pathPrefix + '/orders/', pathPrefix + '/tx/']}
            exact
            component={(): JSX.Element => <Redirect to={pathPrefix + '/search/'} />}
          />
          <Route path={pathPrefix + '/orders/:orderId'} exact component={Order} />
          <Route path={pathPrefix + '/address/:address'} exact component={UserDetails} />
          <Route path={pathPrefix + '/tx/:txHash'} exact component={TransactionDetails} />
          <Route path={pathPrefix + '/search/:searchString?'} exact component={SearchNotFound} />
          <Route component={NotFound} />
        </Switch>
      </React.Suspense>
    </GenericLayout>
  )
}

/**
 * Render Explorer App
 */
export const ExplorerApp: React.FC = () => {
  // Deal with incorrect network
  useNetworkCheck()

  return (
    <>
      <GlobalStyle />
      <MainWrapper>
        <Router basename={process.env.BASE_URL}>
          <StateUpdaters />
          <Switch>
            <Route path="/boba" component={RedirectBoba} />
            <Route path={['/']} component={AppContent} />
          </Switch>
        </Router>
        {process.env.NODE_ENV === 'development' && <Console />}
      </MainWrapper>
    </>
  )
}

export default hot(
  withGlobalContext(
    ExplorerApp,
    // Initial State
    INITIAL_STATE,
    rootReducer,
  ),
)
