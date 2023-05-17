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

test('renders learn react link', () => {
    const validate = ajv.compile(schemaJson)
    const vald = ajv.validate(schemaJson,data)
    const valid = validate(data)
    console.log(valid)
    console.log(parse(schema))
    expect(valid).toBe(false)
})