import React from 'react';
import { Switch, Route } from 'react-router-dom';

import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage'
import MyProfilePage from './pages/MyProfilePage';
import ProjGroupsPage from './pages/ProjGroupsPage';
import OtherUsersPage from './pages/OtherUsersPage';
import UserDetailPage from './pages/UserDetailPage';
import RatingPage from './pages/RatingPage';


const App = () => (

	<Switch>
		<Route path='/' exact component={SignInPage} />
		<Route path='/signup' exact component={SignUpPage} />
		<Route path='/myProfile' exact component={MyProfilePage} />
		<Route path='/projGroups' exact component={ProjGroupsPage} />
		<Route path='/otherUsers' exact component={OtherUsersPage} />
		<Route path='/userDetail' exact component={UserDetailPage} />
		<Route path='/rating' exact component={RatingPage}/>
	</Switch>

)

export default App;
