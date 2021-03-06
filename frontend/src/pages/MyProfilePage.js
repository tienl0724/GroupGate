import React, { Component } from "react";
import axios from 'axios';
import EditableField from '../components/EditableField';
import EditableTextArea from '../components/EditableTextArea';
import CourseList from '../components/CourseList'
import ReferenceList from '../components/ReferenceList';

import Nav from '../components/Nav';
import '../css/style.css';
import auth from '../Auth'
const userId = auth.getUserInfo();

export default class MyProfile extends Component {

  constructor(props) {
    super(props)
      this.state = {
          id: '',
          displayName: '',
          aboutMe: '',
      }
      this.update = this.update.bind(this);
  }

  componentWillMount() {
    this.getUserInfo();
  }

  getUserInfo(){
    console.log(userId)
    axios.get(`http://localhost:3000/api/userinfos?filter={"where":{"userId":{"like":"${userId}"}}}`)
      .then(response => {
        if (response.data[0]){
        this.setState( {
          id: response.data[0].id,
          displayName: response.data[0].display_name,
          aboutMe: response.data[0].about_me,
          }, () => {
          console.log('MP -> Loading user: ', this.state);
        })}
      })
  }

  update( param, newValue, i ){
    var dataPackage
    switch(param){
      case '1':                                          // update display name
        dataPackage = { display_name: newValue };
        this.setState( prevState => ({
          displayName: newValue
        }) );
      break;
      case '2':                                         // update about me
        dataPackage = { about_me: newValue };
        this.setState( prevState => ({
          aboutMe: newValue
        }) );
      break;

      default: console.log('nothing got updated')
    }

    axios.request({
      method:'patch',
      url:`http://localhost:3000/api/userinfos/${this.state.id}`,
      data: dataPackage
    }).then(response => {
    }).catch(err => console.log(err));

  }

  render() {
    return (

        <div>
          <div className="container fluid">

            <Nav />
            <br/>

              {/*Display Name Section*/}
              <h5 className="ui dividing header">Display Name</h5>
              <EditableField label=""
                              value = {this.state.displayName}
                              onChange = {this.update.bind(this)} />

              {/*About Me Section*/}
              <h5 className="ui dividing header">About Me</h5>
              <EditableTextArea label=""
                                value = {this.state.aboutMe}
                                onChange = {this.update.bind(this)} />

              {/*My References Section*/}
              <h5 className="ui dividing header">My Courses with Project Groups</h5>
              <CourseList userId = {userId} />

              {/*My References Section*/}
              <h5 className="ui dividing header">My Reference Profiles</h5>
              <ReferenceList userId = {userId} />

          </div>
      </div>
    );
  }
}

//   {this.state.references.map(this.eachReference)}
