import React, {Suspense} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

const Dashboard = React.lazy(() => import('./Dashboard').then(module => ({ default: module.DashboardPage })));
const Vouchers = React.lazy(() => import('./Vouchers').then(module => ({ default: module.VouchersPage })));

const createRoutes = () => {
  return(
    <Router>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/vouchers" component={Vouchers} />        
        <Redirect to='/' />
        </Switch>
      </React.Suspense>
    </Router>
  )
}

export default createRoutes