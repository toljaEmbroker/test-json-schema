import React from 'react';
import logo from './logo.svg';
import './App.css';
import Ajv, {JSONSchemaType} from "ajv"
const Joi = require('joi');
const parse = require('joi-to-json')

const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

interface MyData {
  foo: number
  bar?: string
}

const schemaJson:JSONSchemaType<MyData> = {
  type: "object",
  properties: {
    foo: {type: "integer"},
    bar: {type: "string",nullable: true},
  },
  required: ["foo"],
  additionalProperties: false,
}

const data = {
  bar: 1,
}


const schema = Joi.object({
  username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),

  password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

  repeat_password: Joi.ref('password'),

  access_token: [
    Joi.string(),
    Joi.number()
  ],

  birth_year: Joi.number()
      .integer()
      .min(1900)
      .max(2013),

  email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
    .with('username', 'birth_year')
    .xor('password', 'access_token')
    .with('password', 'repeat_password');




function App() {
  async function a() {
    console.log(schema.validate({ username: 'abc', birth_year: 1994 }));
// -> { value: { username: 'abc', birth_year: 1994 } }

    console.log(schema.validate({}));
// -> { value: {}, error: '"username" is required' }

// Also -

    try {
      const value = await schema.validateAsync({ username: 'abc', birth_year: 1994 });
      console.log('aa',value)
    }
    catch (err) {
      console.log(err)
    }
  }

  function b() {
    const validate = ajv.compile(schemaJson)
    const jsonSchema = parse(schema)

    const vald = ajv.validate(schemaJson,data)
    const valid = validate(data)
    console.log(valid)
    console.log(validate)
    console.log('vald',vald)
    if (!valid) console.log(validate.errors)
  }

  // function c() {
  //   const jsonSchemaParsed = parse(schema)
  //   const validate = ajv.compile(jsonSchemaParsed)
  //   const valid = validate(data)
  //   console.log(valid)
  //   console.log(validate.schema)
  //   if (!valid) console.log(validate.errors)
  // }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={()=>a()}>joi</button>
        <button onClick={()=>b()}>json</button>
        {/*<button onClick={()=>c()}>jsonParsed</button>*/}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
