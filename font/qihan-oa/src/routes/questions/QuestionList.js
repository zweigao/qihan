import React from 'react';
import {connect} from 'dva';
import { Table, Card, Icon, Popconfirm, Spin, Modal, Row, Col, Cascader, Button, Message } from 'antd';
import { QuestionForm } from './QuestionAdd';
import MenuTree from '../../components/MenuTree'

class QuetionList extends React.Component{

  constructor (props){
    super(props);
    this.state = {
      updateVisible: false,
      menuEditable: false,
      showMenuTreeModal: false
    };
    if (props.category.data.length==0) {
      props.dispatch({type: 'category/getList'})
    }
    props.dispatch({type: 'questions/getAll'})
    this.onRowChange = this.onRowChange.bind(this)
    this.toggleMenuTreeModal = this.toggleMenuTreeModal.bind(this)
    this.onCascaderChange = this.onCascaderChange.bind(this)
    this.handleRelativeOk = this.handleRelativeOk.bind(this)
    this.handleOk = this.handleOk.bind(this)
  }

  handleOk (){
    let {dispatch} = this.props;
    const { optionKeys } = this.props.questions
    let form = this.refs['form'];
    form.validateFieldsAndScroll((err, values) => {
      let optionList = JSON.stringify(optionKeys.map((k) => {
        return values['option' + k]
      }))
      let standardAnswer = values['standardAnswer_' + values.questionType]
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
          type: 'questions/upd',
          payload: {
            menuItemIds: category,
            paperName: values.paperName,
            questionBank: {
              id: this.state.row.id,
              analysis: values.analysis,
              content: values.content,
              questionType: values.questionType,
              standardAnswer,
              optionList
            }
          }
        });
        this.setState({updateVisible:false})
      }
    })
  };

  handleRelativeOk () {
    let postData = []
    if (this.props.category.selCategory.length === 0) {
      message.error('请选择一个分类', 4)
    }
    const menuItems = this.props.category.selCategory.map(c => ({id: c.id, name: c.label}))
    this.props.questions.selectedRows.map((v) => {
      postData.push({learnVideoId: v.id, menuItems})
    })
    this.props.dispatch({
      type: 'questions/updRelativeSync',
      data: postData
    })
    this.toggleMenuTreeModal(false)
  }

  handleCancel () {
    this.setState({
      updateVisible: false
    });
  };

  showQuestionForm (row) {
    row.category = this.initMenuTree(row)
    this.setState({updateVisible:true,row});
  };

  renderColumns () {
    let {dispatch} = this.props;
    const QUESTION_TYPE = {
      SINGLE_OPTION: '单选',
      MULTIPLE_OPTION:'多选',
      FILL_IN: '填空',
      DESCRIPTION: '简述',
      HEARING: '听力',
      TRUE_OR_FALSE: '判断'
    }
    return [{
      title: '题干',
      dataIndex: 'content',
      width: '35%'
    }, {
      title: '分析',
      dataIndex: 'analysis',
      width: '15%'
    }, {
      title: '选项',
      dataIndex: 'optionList',
      width: '15%',
      render: list => {
        let text = ''
        if (Array.isArray(list)) {
          list.forEach((l, index) => {
            text += String.fromCharCode(65+index) + '、' + l + ' '
          })
        }
        return text
      }
    }, {
      title: '题型',
      dataIndex: 'questionType',
      width: '5%',
      render: text => QUESTION_TYPE[text]
    }, {
      title: '参考答案',
      dataIndex: 'standardAnswer',
      width: '15%'
    }, {
      title: '操作',
      width: '10%',
      render: (v,row) =>{
        let style = {fontSize:'1.5em',marginRight:'.5em',verticalAlign:'middle'};
        return [
          <Icon key={1} type="edit" style={{color:'cadetblue',...style}} onClick={() => this.showQuestionForm(row)}/>,
          <Popconfirm key={2} title="确认删除?" onConfirm={()=>dispatch({type:'questions/del',ids:[row.id]})} okText="确定" cancelText="取消">
            <Icon type="delete" style={{color:'tomato',...style}}/>
          </Popconfirm>
        ]
      }
    }];
  };

  initMenuTree (row) {
    const category = row.menuArray.map((k) => {
      return {
        key: k.name,
        label: k.name,
        id: k.id + ''
      }
    })
    this.props.dispatch({
      type: 'category/setSelCategory',
      selCategory: category
    })
    return category
  }

  toggleMenuTreeModal (show) {
    const rows = this.props.questions.selectedRows[0]
   /* const editable = rows.every((r) => {
      // return r.menuArray.
    })*/
    this.setState({
      ...this.state,
      showMenuTreeModal: show
    })
  }

  onCascaderChange (value) {
    const id = value[value.length - 1]
    this.props.dispatch({type: 'questions/getAll', menuItemId: id})
  }

  onRowChange(selectedRowKeys, selectedRows) {
    this.props.dispatch({type: 'questions/setSelectedRows', selectedRows})
    this.setState({menuEditable: selectedRowKeys.length > 0})
  }

  render() {
    let vLoading = this.props.questions.loading
    let category = this.props.category.data
    const data = this.props.questions.data && this.props.questions.data.map(q => ({...q, key: q.id}))
    const { dispatch } = this.props
    const locale = { emptyText: '暂无数据，点击左上方选择一个类别'}
    const rowSelection = {
      onChange: this.onRowChange
    }

    return (
      <Card title="题目列表">
        <Row style={{marginBottom: '10px'}}>
          <Col span={16}><Spin style={{width: "300px"}} spinning={this.props.loading}><Cascader style={{width: "300px"}} size="large" options={category} onChange={this.onCascaderChange} placeholder="选择一个类别"/></Spin></Col>
          <Col style={{float: 'right'}}>
            <Popconfirm key={3} title="确认删除选中的题目?" onConfirm={()=>dispatch({type:'questions/del',ids:this.props.questions.selectedRows.map(v=>v.id)})} okText="确定" cancelText="取消">
              <Button type="dashed" size="large" disabled={!this.state.menuEditable}>删除</Button>
            </Popconfirm>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Spin spinning={vLoading}><Table locale={locale} rowSelection={rowSelection} columns={this.renderColumns()} dataSource={data} /></Spin>
          </Col>
        </Row>
        <Modal title="修改题目信息"
               visible={this.state.updateVisible}
               onOk={this.handleOk}
               confirmLoading={vLoading}
               onCancel={this.handleCancel.bind(this)}>
          { this.state.updateVisible ? <QuestionForm {...this.props} ref="form" row={this.state.row} /> : null }
        </Modal>
        <Modal title="选择分类"
               visible={this.state.showMenuTreeModal}
               onOk={this.handleRelativeOk}
               onCancel={() => this.toggleMenuTreeModal(false)}>
          <MenuTree></MenuTree>
        </Modal>
      </Card>
    );
  }

}

export default connect(({questions, category, loading})=>({questions, category, loading: loading.global}))(QuetionList);
