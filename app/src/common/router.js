import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from '../container/home';
import TaskPage from '../container/task';
import TopicPage from '../container/topic';

class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={ HomePage }></Route>
          <Route path='/task' component={ TaskPage }></Route>
          <Route path='/topic' component={ TopicPage }></Route>
        </Switch>
      </BrowserRouter>
    );
  }
};

export default Router;