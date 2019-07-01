/*
  App.js - Raect based UI for serverless backend
  Heal1-React-app

  Created by Prashuk Ajmera on 5/10/19.
  Copyright © 2019 Prashuk Ajmera. All rights reserved.
*/

import React from "react";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    // setting initial state
    this.state = {
      data: "",
      tags: "",
      displayForm: false,
      newTags: []
    };
    this.updateSearch = this.updateSearch.bind(this);
    this.addTag = this.addTag.bind(this);
    this.addItem = this.addItem.bind(this);
    this.addtoDB = this.addtoDB.bind(this);
  }

  // Get data from api
  getData(keyappend) {
    try {
      return fetch("http://localhost:15001/ingredients/" + keyappend)
        .then(response => response.json())
        .then(responseJson => {
          // condition for proper key fetch
          if (typeof responseJson.Item !== "undefined") {
            this.setState({
              data: responseJson.Item,
              tags: Object.keys(responseJson.Item.tags) + " ",
              displayForm: false,
              newTags: []
            });
            // console.log(responseJson.Item);
          } else {
            this.setState({
              data: "",
              tags: "",
              displayForm: false,
              newTags: []
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {}

  // Searching key value
  updateSearch(e) {
    if (e.target.value) {
      this.getData(e.target.value);
    }
  }

  // Add new ingredient
  addItem() {
    this.setState({
      displayForm: true
    });
  }

  // Add tag item for new ingredient
  addTag() {
    const newTags = this.state.newTags.concat({});
    this.setState({
      newTags: newTags
    });
  }

  // Add new intgredient to database
  addtoDB() {
    const key = document.getElementById("text").value;

    // Creating dataset similar to the given JSON formate
    var data = {};
    data[key] = {};
    data[key].text = key;
    data[key].tags = {};

    this.state.newTags.forEach((k, index) => {
      data[key].tags[
        document.getElementById("document-" + index + "-document").value
      ] = 1;
    });

    // console.log(data);

    fetch("http://localhost:15001/add-ingredients", {
      method: "PUT",
      dataType: "JSON",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(data)
    })
      .then(resp => {
        return resp.json();
      })
      .catch(error => {
        console.log(error);
      });
  }

  // Rendering the UI
  render() {
    const newTags = this.state.newTags.map((Element, index) => {
      return <NewIngredient key={index} index={index} value={Element.tag} />;
    });
    let form = null;
    if (this.state.displayForm) {
      form = (
        <div>
          Ingredient:
          <div>
            <input type="text" placeholder="Ingredient" id="text" />
          </div>
          <br />
          <div>
            Tags:{" "}
            <button type="button" onClick={this.addTag}>
              {" "}
              Add Tag{" "}
            </button>
            <div className="inputs">{newTags}</div>
          </div>
          <div>
            <button type="button" onClick={this.addtoDB}>
              {" "}
              Add{" "}
            </button>
          </div>
        </div>
      );
    }
    return (
      <form className="form" id="addItemForm">
        <input type="text" onChange={this.updateSearch} placeholder="Search" />
        <div>Ingredient: {this.state.data.text}</div>
        <div>Tags: {this.state.tags}</div>
        <br />
        <br />
        <div>Post new Ingredients</div>
        <button type="button" onClick={this.addItem}>
          Add Item
        </button>
        <br />
        <br />
        {form}
      </form>
    );
  }
}

// Class for adding tags to new ingredient
class NewIngredient extends React.Component {
  render() {
    return (
      <div>
        <input
          type="text"
          name={`document-${this.props.index}-document`}
          placeholder="Tag"
          id={`document-${this.props.index}-document`}
        />
        <br />
      </div>
    );
  }
}
