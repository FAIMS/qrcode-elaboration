/*
 * Copyright 2021 Macquarie University
 *
 * Licensed under the Apache License Version 2.0 (the, "License");
 * you may not use, this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND either express or implied.
 * See, the License, for the specific language governing permissions and
 * limitations under the License.
 *
 * Filename: ExampleForm.tsx
 * Description:
 *   An example form for testing QRCodeFormField
 */

// @ts-ignore
import React from 'react'
import { Field, Form, Formik } from 'formik'
import { QRCodeFormField } from './QRCodeFormField'
import Button from '@mui/material/Button'
import './ExampleForm.css'

const ExampleForm = () => {
  return (
    <Formik
      initialValues={{ sample: '' }}
      onSubmit={(values: any, actions: any) => {
        console.log(values)
        actions.setSubmitting(false)
      }}
    >
      {(formProps) => (
        <div id='demoformcontainer'>
          <div id='theform'>
            <h1>Test Form</h1>
            <Form>
              <p>Sample form field</p>
              <Field
                label='This label was set explicitly'
                name='sample'
                component={QRCodeFormField}
              />
              <p></p>
              <Button variant='contained' color='primary' type='submit'>
                Submit
              </Button>
            </Form>
          </div>
          <div id='formvaluedisplay'>
            <pre>{JSON.stringify(formProps.values, null, 2)}</pre>
          </div>
        </div>
      )}
    </Formik>
  )
}

export default ExampleForm
