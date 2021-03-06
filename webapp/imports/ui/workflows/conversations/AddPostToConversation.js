import React  from 'react';
import ReactMixin from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Bert } from 'meteor/themeteorchef:bert';
import { FormGroup } from 'react-bootstrap';
import { CardText } from 'material-ui/Card';

import { insertPost } from '../../../api/posts/methods.js';
import { GlassCard } from '/imports/ui/components/GlassCard';

import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export class AddPostToConversation extends React.Component {
  getMeteorData() {

    let data = {
      style: {}
    };

    // this should all be handled by props
    // or a mixin!
    if (Session.get('darkroomEnabled')) {
      data.style.color = 'black';
      data.style.background = 'white';
    } else {
      data.style.color = 'white';
      data.style.background = 'black';
    }

    // this could be another mixin
    if (Session.get('glassBlurEnabled')) {
      data.style.filter = 'blur(3px)';
      data.style.webkitFilter = 'blur(3px)';
    }

    return data;
  }

  handleKeypress(topicId, event, title){
    Session.set('postContent', title);

    if (title !== '' && event.keyCode === 13) {
      this.handleInsertPost(topicId, title, event.target);
    }
  }
  handleAddPostButton(topicId, event, value){
    this.handleInsertPost(topicId, Session.get('postContent'), event.target);
  }
  handleInsertPost(topicId, title, target){
    let newPost = {
      title: title,
      createdAt: new Date(),
      createdBy: {
        display: Meteor.user().fullName(),
        reference: Meteor.userId()
      },
      topicId: topicId
    };

    if (Meteor.user().profile && Meteor.user().profile.avatar) {
      newPost.createdBy.avatar = Meteor.user().profile.avatar;
    }

    //console.log("newPost", newPost);

    insertPost.call(newPost, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        target.value = '';
        Bert.alert('Post added!', 'success');
      }
    });
  }

  render(){
    return (
      <GlassCard id='addPostToConversationCard'>
        <CardText>
          <TextField
            id='addPostToConversationInput'
            ref='addPostToConversationInput'
            name='addPost'
            floatingLabelText='Add Post'
            onChange={ this.handleKeypress.bind(this, this.props.topicId) }
            multiLine={true}
            rows={5}
            fullWidth
            /><br/>
          <RaisedButton id='addPostButton' onMouseUp={ this.handleAddPostButton.bind(this, this.props.topicId) } primary={true} label='Post' />
        </CardText>
      </GlassCard>
    );
  }
}

ReactMixin(AddPostToConversation.prototype, ReactMeteorData);
