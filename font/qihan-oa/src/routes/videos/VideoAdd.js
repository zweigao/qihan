import React from 'react';
import {connect} from 'dva';
import { Form, Input, Button, Card, Tree, Select, Modal, Icon, Row, Col } from 'antd';
import MenuTree from '../../components/MenuTree'
const TreeNode = Tree.TreeNode
const FormItem = Form.Item;

class VideoAdd extends React.Component{

  constructor (props) {
    super(props)
    if (props.category.data.length==0) {
      props.dispatch({type: 'category/getList'})
    }
  }

  render() {
    return <Card title="添加视频资源"><VideoForm {...this.props}/></Card>
  }

}

export const VideoForm = Form.create()(React.createClass({

  getInitialState () {
    return {
      visible: false
    }
  },

  handleSubmit(e) {
    let {dispatch,form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      values.category = values.category && values.category.map((v) => {
        return v.id
      })
      if (!err) {
        dispatch({
          type: 'videos/add',
          ...values
        });
        form.setFieldsValue({title: '', url: ''})
      }
    });
  },
  onModalOk () {
    this.props.form.setFieldsValue({category: this.props.category.selCategory})
    this.setState({
      visible: false
    })
  },
  render() {
    let {row} = this.props;
    if (!row) row = {};
    const { getFieldDecorator } = this.props.form;
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
    return (
      <Form horizontal onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="视频标题"
          hasFeedback>
          {getFieldDecorator('title', {
            initialValue: row.name,
            rules: [{
              required: true, message: '请输入标题'
            }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="视频地址"
          hasFeedback>
          {getFieldDecorator('url', {
            initialValue: row.videoUrl,
            rules: [{
              type: 'url', message: '请输入正确的视频地址'
            },{
              required: true, message: '请输入视频地址'
            }]
          })(
            <Input />
          )}
        </FormItem>
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
                  searchPlaceholder="标签模式"
                  onBlur={this.onBlur}
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
          <Button type="primary" htmlType="submit" loading={this.props.videos.loading} size="large">保存</Button>
        </FormItem>
        <Modal title="选择分类"
               visible={this.state.visible}
               onOk={this.onModalOk}
               onCancel={() => {this.setState({ visible: false })}}>
          <MenuTree></MenuTree>
        </Modal>
      </Form>
    );
  },

}));

export default connect(({videos, category})=>({videos, category}))(VideoAdd);
