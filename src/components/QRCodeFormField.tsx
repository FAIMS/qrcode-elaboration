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
 * Filename: QRCodeFormField.tsx
 * Description:
 *   Implement QRCodeFormField for scanning QR codes into a field in FAIMS3
 */

import React, { useState } from 'react'
import styles from './QRCodeFormField.module.css'
import Button from '@mui/material/Button'

import { BarcodeScanner, ScanResult } from '@capacitor-community/barcode-scanner'

import { FieldProps } from 'formik'
import ReactDOM from 'react-dom'


export interface QRCodeFieldProps extends FieldProps {
  label?: string
}

export function QRCodeFormField({
  field,
  form,
  ...props
}: QRCodeFieldProps): JSX.Element {
  // get previous form state if available
  let initialValue = {}
  if (form.values[field.name]) {
    initialValue = form.values[field.name]
  }
  const [state, setState] = useState(initialValue)
  const [scanning, setScanning] = useState(false)
  const [canScan, setCanScan] = useState(true)

  const pluginCallback = (value: any) => {
    setState(value)
    form.setFieldValue(field.name, value)
  }

  const startScan = async () => {

    const formcontainer = document.getElementById('demoformcontainer')

    console.log('Checking for permissions')
    let permissions
    let faked = false
    // check that we have camera permission
    try {
      permissions = await BarcodeScanner.checkPermission({ force: true })
      console.log('Permissions result', JSON.stringify(permissions))
    } catch {
      console.log('Cannot Scan')
      // pluginCallback("fake value")
      setCanScan(false)
      permissions = {granted: true}
      faked = true
    }


    if (permissions.granted) {
      console.log("have permission", faked)
      // hide the form so we can overlay the viewfinder
      if (formcontainer) {
        formcontainer.classList.add('hidden')
      }
      
      if (!faked) {
        // make background of WebView transparent
        BarcodeScanner.hideBackground()
      }
      // and everything else too
      document.getElementsByTagName('body')[0].classList.add('transparent')

      setScanning(true)

      let result: ScanResult = {hasContent: true, content: "fake value" + Math.floor(Math.random() * 100)}
      if (!faked) {
          result = await BarcodeScanner.startScan({})
                                .then((r) => {
                                  stopScan()
                                  return r
                                })
      }

      // if the result has content
      if (result.hasContent) {
        console.log('Barcode content:', result.content) // log the raw scanned content
        pluginCallback(result.content)
      }

    } else {
      console.log('No permission for QR')
    }
  }

  const stopScan = () => {
    BarcodeScanner.showBackground().catch(e => console.log('showBackground'))

    const formcontainer = document.getElementById('demoformcontainer')
    if (formcontainer) {
      formcontainer.classList.remove('hidden')
    }
    BarcodeScanner.stopScan().catch(e => console.log('stopScan'))
    setScanning(false)
  }

  // a string version of the value
  // to display below the form field
  const valueText = JSON.stringify(state)

  if (scanning) {
    const target = document.getElementById('qrscanner')
    if (target) {
      console.log('rendering portal')
      return ReactDOM.createPortal(
        (
              <div className={styles.container}>
                <div className={styles.barcodeContainer}>
                  <div className={styles.relative}>
                    <p>Aim your camera at a barcode</p>
                    <Button variant='outlined'  onClick={stopScan}>Stop Scan</Button>
                  </div>
                  <div className={styles.square}>
                    <div className={styles.outer}>
                      <div className={styles.inner}></div>
                    </div>
                  </div>
                </div>
              </div>
        ), 
     target )
    } else {
      // how did we get here? 
      return (<div>Something went wrong</div>)
    }
  } else {
    if (!canScan) {
      return (
        <div>
          <p>{props.label}</p>
          <Button variant='outlined' onClick={startScan}>Scan QR Code</Button>
          <div>Scanning not supported</div>
          <div>{valueText}</div>
        </div>
      )
    } else {
      return (
        <div>
          <p>{props.label}</p>
          <Button variant='outlined' onClick={startScan}>Scan QR Code</Button>
          <div>{valueText}</div>
        </div>
      )
    }
  }
}
