import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import UnauthenticatedRoute from "../components/UnauthenticatedRoute";
import Home from "../components/Home";
import Login from "../components/auth/LoginForm";
import Register from "../components/auth/Register";
import Todo from "../components/Todo";
import Notes from '../components/Notes';
import Link from '../components/Link';
import Images from '../components/Images';
import Profile from '../components/Profile';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/Register">
        <Register />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/Todo">
        <Todo />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/Notes">
        <Notes />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/Link">
        <Link />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/gallery">
        <Images />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/profile">
        <Profile />
      </AuthenticatedRoute>
    </Switch>
  );
}
