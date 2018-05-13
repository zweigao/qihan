import React from 'react';
import {
  connect
} from 'dva';
import {
  Card,
  WhiteSpace,
  Icon,
  List
} from 'antd-mobile';
import ApplyForm from '../components/Applyment/ApplyForm'

function Applyment({
  dispatch,
  applyment,
  location
}) {
  const formProps = {
    applyment,
    location,
    getIdCardInfo(idCard) {
      dispatch({
        type: 'applyment/fetchIdCardInfo',
        payload: {
          idCard
        }
      })
    },
    getDisplayItems(id) {
      dispatch({
        type: 'applyment/fetchDisplayItems',
        payload: {
          id
        }
      })
    },
    uploadImage(type, image) {
      dispatch({
        type: 'applyment/uploadImage',
        payload: {
          type,
          image
        }
      })
    },
    register(data) {
      dispatch({
        type: 'applyment/register',
        payload: {
          data
        }
      })
    },
    getPhoneCodeValidator(phoneCode) {
      dispatch({
        type: 'applyment/fetchPhoneCodeValidator',
        payload: {
          phoneCode
        }
      })
    },
    getPhoneCodeValidatorForModify(phoneCode) {
      dispatch({
        type: 'applyment/fetchPhoneCodeValidatorForModify',
        payload: {
          phoneCode
        }
      })
    },
    getApplymentInfo(registerId, idCode) {
      dispatch({
        type: 'applyment/fetchApplymentInfo',
        payload: {
          registerId,
          idCode
        }
      })
    },
    updateRegisterInfo(data) {
      dispatch({
        type: 'applyment/updateRegisterInfo',
        payload: {
          data
        }
      })
    }
  }
  return (
    <div>
      <ApplyForm {...formProps}></ApplyForm>
    </div>
  );
}

export default connect(({
  applyment
}) => ({
  applyment
}))(Applyment);