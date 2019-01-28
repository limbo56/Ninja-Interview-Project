import React, { PureComponent } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import {List ,AddDevice, EditDevices} from '../views';

import '../css/App.css';

class Rooter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      devices: []
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <BrowserRouter>
          <Switch>
            <Route  path='/devices/edit/:id' component={EditDevices} />
            <Route exact path='/devices/add' component={AddDevice} />
            <Route exact path='/' component={List} />
          </Switch>
        </BrowserRouter>
        <footer>

        </footer>
      </div>
    );
  }
}

export default Rooter;
