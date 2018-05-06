import React from 'react';
import {connect} from 'dva';
import { Form, Input, Button, Card, Tree, Select, Modal, Icon, Row, Col } from 'antd';
import MenuTree from '../../components/MenuTree'
const TreeNode = Tree.TreeNode
const FormItem = Form.Item;
const Option = Select.Option

class QuestionAdd extends React.Component{

  constructor (props) {
    super(props)
    if (props.category.data.length==0) {
      props.dispatch({type: 'category/getList'})
    }
  }

  render() {
    return <Card title="添加题目"><QuestionForm {...this.props}/></Card>
  }

}

let uuid = 1
export const QuestionForm = Form.create()(React.createClass({

  getInitialState () {
    let initialState = {
      visible: false,
      isCourse: false,
      questionType: ''
    }
    let { row, dispatch } = this.props
    if (row) {
      initialState.questionType = row.questionType
      if (row.questionType === 'MULTIPLE_OPTION') {
        row.standardAnswer = row.standardAnswer.split(',')
      }
    }
    return initialState
  },

  componentDidMount () {
    let { row, dispatch } = this.props
    if (row && row.optionList && row.optionList.length > 0) {
      const keys = row.optionList.map((o, index) => {
        row['option' + index] = o
        return index
      })
      row['standardAnswer_' + row.questionType] = row.standardAnswer
      dispatch({type: 'questions/setOptionKeys', keys: keys})
    }
  },

  // componentWillReceiveProps (nextProps) {
  //   let { row, dispatch } = this.props
  //   if (nextProps.row && nextProps.row !== this.props.row) {
  //     if (nextProps.row.optionList && nextProps.row.optionList.length > 0) {
  //       const keys = row.optionList.map((o, index) => {
  //         return index
  //       })
  //       dispatch({type: 'questions/setOptionKeys', keys: keys})
  //     }
  //   } else {
  //     dispatch({type: 'questions/setOptionKeys', keys: [0, 1]})
  //   }
  //   console.log(nextProps.row)
  // },

  handleSubmit(e) {
    let {dispatch,form,questions} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      let optionList = JSON.stringify(questions.optionKeys.map((k) => {
        return values['option' + k]
      }))
      let standardAnswer = values['standardAnswer_' + this.state.questionType]
      if (values.questionType === 'MULTIPLE_OPTION') {
        standardAnswer = standardAnswer.sort((a, b) => a > b).join(',')
      } else if (values.questionType === 'TRUE_OR_FALSE') {
        optionList = JSON.stringify(['对', '错'])
      }
      console.log(optionList, standardAnswer)
      const category = values.category && values.category.map((v) => {
        return v.id
      })
      if (!err) {
        dispatch({
          type: 'questions/add',
          menuItemIds: category,
          paperName: values.paperName,
          questionBank: {
            analysis: values.analysis,
            content: values.content,
            questionType: values.questionType,
            standardAnswer,
            optionList
          }
        });
        this.props.form.resetFields()
      }
    });
  },
  onModalOk () {
    this.props.form.setFieldsValue({category: this.props.category.selCategory})
    this.setState({
      ...this.state,
      visible: false,
      isCourse: this.props.category.selCategory.some(c => c.isCourse)
    })
  },
 
  render() {
    let {row = {}, dispatch} = this.props;
    const { getFieldDecorator } = this.props.form
    const { visible, isCourse, questionType } = this.state
    const { optionKeys } = this.props.questions
    const haveOptions = questionType === 'SINGLE_OPTION' || questionType === 'MULTIPLE_OPTION' || questionType === 'TRUE_OR_FALSE'
    const category = this.props.category.category
    const selectedMessage = this.props.category.selectedMessage
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6,
      },
    };
    const options = [
      <Option key="1" value="SINGLE_OPTION">单选题</Option>,
      <Option key="2" value="MULTIPLE_OPTION">多选题</Option>,
      <Option key="3" value="FILL_IN">填空题</Option>,
      <Option key="4" value="HEARING">听力</Option>,
      <Option key="4" value="DESCRIPTION">简述</Option>,
      <Option key="4" value="TRUE_OR_FALSE">判断</Option>,
    ]

    return (
      <Form horizontal onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="题目题干"
          hasFeedback>
          {getFieldDecorator('content', {
            initialValue: row.content,
            rules: [{
              required: true, message: '请输入题干'
            }]
          })(
            <Input type="textarea" rows={4}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="题目分析"
          hasFeedback>
          {getFieldDecorator('analysis', {
            initialValue: row.analysis
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="题目类型"
          hasFeedback>
          {getFieldDecorator('questionType', {
            initialValue: row.questionType,
            rules: [{
              required: true, message: '请选择一个题目类型'
            }]
          })(
            <Select placeholder="请选择一个题目类型" onChange={((value) => {this.setState({...this.state, questionType: value})}).bind(this)}>
              {options}
            </Select>
          )}
        </FormItem>
        {(questionType === 'SINGLE_OPTION' || questionType === 'MULTIPLE_OPTION') && optionKeys.map((k, index) => {
          return (
            <FormItem
              {...formItemLayout}
              label="选项"
              key={k}>
              {getFieldDecorator('option' + k, {
                initialValue: row['option' + k],
                rules: [{ required: true, message: '请输入选项内容'}]
              })(
                <Input addonBefore={String.fromCharCode(65 + index)} style={{ width: '90%'}} placeholder="请输入选项内容" />
              )}
              <Icon
                style={{position: 'absolute', top: 4, right: 0, fontSize: 24}}
                type="minus-circle-o"
                onClick={() => dispatch({type: 'questions/removeOption', k: k})}
              />
            </FormItem>
          )
        })}
        {(questionType === 'SINGLE_OPTION' || questionType === 'MULTIPLE_OPTION') &&
          <FormItem wrapperCol={{span: 14, offset: 6}} >
            <Button type="dashed" onClick={() => dispatch({type: 'questions/addOption'})} style={{ width: '100%' }}>
              <Icon type="plus" /> 添加选项
            </Button>
          </FormItem>
        }
        <FormItem
          {...formItemLayout}
          label="参考答案"
          hasFeedback>
          {getFieldDecorator('standardAnswer_' + questionType, {
            initialValue: row.standardAnswer
          })(
            haveOptions ?
              <Select
                placeholder="请选择标准答案"
                multiple={questionType === 'MULTIPLE_OPTION'}
              >
                {questionType === 'TRUE_OR_FALSE' ?
                  ['对', '错'].map((o, i) => <Option key={i} value={i === 0 ? '对' : '错'}>{i === 0 ? '对' : '错'}</Option>):
                  optionKeys.map((o, i) => <Option key={i} value={String.fromCharCode(65+i)}>{String.fromCharCode(65+i)}</Option>)}
              </Select> :
              <Input type="textarea"/>
          )}
        </FormItem>
        {isCourse ?
          <FormItem
            {...formItemLayout}
            label="所属试卷"
            hasFeedback>
            {getFieldDecorator('paperName', {
              initialValue: row.paperName,
              rules: [{
                required: true, message: '请填写所属试卷名称'
              }]
            })(
              <Input type="textarea"/>
            )}
          </FormItem> : null
        }
        <FormItem
          {...formItemLayout}
          wrapperCol={{span: 12}}
          label="所属类别">
          <Row gutter={8}>
            <Col span={20}>
              {getFieldDecorator('category', {
                initialValue: row.category,
                rules: [{
                  required: true, message: '请选择类别', type: 'array'
                }]
              })(
                <Select tags
                  labelInValue
                  showSearch={true}
                  placeholder="点击右侧按钮选择分类"
                  size="large"
                >
                </Select>
              )}
            </Col>
            <Col span={2}>
              <Button size="large" onClick={() => {this.setState({ visible: true })}}>选择</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem {...tailFormItemLayout} style={{display:this.props.row?'none':'block'}}>
          <Button type="primary" htmlType="submit" loading={this.props.questions.loading} size="large">保存</Button>
        </FormItem>
        <Modal title="选择分类"
               visible={visible}
               onOk={this.onModalOk}
               onCancel={() => {this.setState({ visible: false })}}>
          <MenuTree></MenuTree>
        </Modal>
      </Form>
    );
  },

}));

export default connect(({questions, category})=>({questions, category}))(QuestionAdd);
