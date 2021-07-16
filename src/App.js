import './App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import 'antd/dist/antd.css'
import { Steps, Form, Input, Modal, Button, message } from 'antd';
import {AppTable} from './AppTable'

//the original createForm
const CreateForm = ({visible, onCreate, onCancel})=>{
  const [form] = Form.useForm();
  return (
    <Modal 
    title="Add a new App" 
    visible={visible} 
    onOk={() => {
      form
        .validateFields()
        .then((values) => {
          form.resetFields();
          onCreate(values);
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    }}
    onCancel={onCancel} 
    destroyOnClose={true}>
        <Form
          form={form}
          name="ADD APP" 
          preserve={false}
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
          label="App ID"
          name="app_ID"
          rules={[
            {
            required: true,
            message: 'Please input the APP ID!',
            },
            {
              len:5,
              message: 'App ID must be 5 digits'
            },
            {
              pattern: /^[0-9]+$/,
              message: 'Digits only!'
            }
          ]}
          >
          <Input />
          </Form.Item>
          <Form.Item
          label="App Name"
          name="app_name"
          rules={[
            {
            required: true,
            message: 'Please give the APP a name!',
            },
          ]}
          >
          <Input />
          </Form.Item>
          <Form.Item
          label="Description"
          name="description"
          rules={[
            {
            required: false
            },
          ]}
          >
          <Input />
          </Form.Item>
        </Form>
      </Modal>
  );
}

//the new one with steps
const CreateStepForm = ({visible, onCreate, onCancel})=>{
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const { Step } = Steps;

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: 'First',
      content: <Form
      form={form}
      name="ADD APP" 
      preserve={true}
      labelCol={{
        span: 7,
      }}
      wrapperCol={{
        span: 12,
      }}
      initialValues={{
        remember: true,
      }}
      >
      <Form.Item
      label="App ID"
      name="app_ID"
      rules={[
        {
        required: true,
        message: 'Please input the APP ID!',
        },
        {
          len:5,
          message: 'App ID must be 5 digits'
        },
        {
          pattern: /^[0-9]+$/,
          message: 'Digits only!'
        }
      ]}
      >
      <Input />
      </Form.Item>
      <Form.Item
      label="App Name"
      name="app_name"
      rules={[
        {
        required: true,
        message: 'Please give the APP a name!',
        },
      ]}
      >
      <Input />
      </Form.Item>
      <Form.Item
      label="Description"
      name="description"
      rules={[
        {
        required: false
        },
      ]}
      >
      <Input />
      </Form.Item>
    </Form>,
    },
    {
      title: 'Second',
      content: <>
      <p style={{color:"black"}}>Please confirm your Input:</p>
      <table>
        <tbody>
        <tr>
          <td style={{textAlign:"right", color:"DimGrey", paddingTop: "0px"}}>App ID</td>
          <td style={{textAlign:"left", color:"black", paddingTop: "0px"}}>{form.getFieldValue("app_ID")}</td>
        </tr>
        <tr>
          <td style={{textAlign:"right", color:"DimGrey", paddingTop: "0px"}}>App Name</td>
          <td style={{textAlign:"left", color:"black", paddingTop: "0px"}}>{form.getFieldValue("app_name")}</td>
        </tr>
        <tr>
          <td style={{textAlign:"right", color:"DimGrey", paddingTop: "0px"}}>Description</td>
          <td style={{textAlign:"left", color:"black", paddingTop: "0px"}}>{form.getFieldValue("description")}</td>
        </tr>
        </tbody>
      </table>
      </>,
    },
    {
      title: 'Last',
      content: 
      <>
      <p style={{color:"black"}}>The insert *should* be successful </p>
      </>,
    },
  ];

  return (
    <Modal 
    title="Add a new App" 
    width="600px"
    visible={visible} 
    onCancel={onCancel}
    footer={[]}
    destroyOnClose={true}>
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <br></br>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current < steps.length - 2 && (
          <Button type="primary" onClick={() => {
            //check form input before allowing next
            form
            .validateFields()
            .then(()=>{
              next();
            });
          }}>
            Next
          </Button>
        )}
        {current === steps.length - 2 && (
          <Button type="primary" onClick={() => {
            const values = {
              app_ID: form.getFieldValue("app_ID"),
              app_name: form.getFieldValue("app_name"),
              description: form.getFieldValue("description")
            };
            onCreate(values);
            next();
            }}>
            Insert
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => {
            setCurrent(0);//set Steps back to first stage
            form.resetFields();
            onCancel();//close dialog
            message.success('Processing complete!');
          }}>
            Done
          </Button>
        )}
        {current === steps.length -2 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
      </Modal>
  );
}

const EditDialog = (props) => {
  const [form] = Form.useForm();
  const name = props.values.app_name;
  const desc = props.values.description;
  return (
    <Modal 
    title={"Edit "+ props.values.app_ID+": "+props.values.app_name}
    visible={props.visible} 
    onOk={() => {
      form
        .validateFields()
        .then((values) => {
          form.resetFields();
          props.onEdit(values);
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    }}
    onCancel={()=>{
      props.onCancel();
    }} 
    destroyOnClose={true}>
        <Form
          form={form}
          name="EDIT APP" 
          preserve = {false}
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{

          }}
        >
          <Form.Item
          label="App Name"
          name="app_name"
          rules={[
            {
            required: true,
            message: 'Please give the APP a name!',
            },
          ]}
          >
          <Input 
          placeholder= {name}/>
          </Form.Item>
          <Form.Item
          label="Description"
          name="description"
          rules={[
            {
            required: false
            },
          ]}
          >
          <Input 
          placeholder={desc}/>
          </Form.Item>
        </Form>
      </Modal>
  );
}

const DeleteDialog = (props)=>{
  return (
    <Modal
    visible = {props.visible}
    onOk = {()=>{
      props.onDelete(props.values)
    }}
    onCancel = {props.onCancel}
    >
      <h3 style={{color: 'black'}}>Delete {props.values.app_name} ?</h3>
    </Modal>
  )
}

function App() {
  const [apps, setApps] = useState([]);
  const [visible, setVisible] = useState(false);//for add dialog
  const [visible2, setVisible2] = useState(false);//for delete dialog
  const [editVisible, setEditVisible] = useState(false);
  const [deleteVal, setDeleteVal] = useState({app_ID:'',app_name:'',description:''});
  const [editVal, setEditVal] = useState({app_ID:'',app_name:'',description:''});

  //when the "add new" dialog is closed on "CREATE"
  const onCreate = (values) => {
    console.log('Received values of form: ', values);

    var data = new FormData();
    data.append('app_ID',values.app_ID)
    data.append('app_name',values.app_name)
    data.append('description',values.description)

    //POST the form data (INSERT)
    axios
    .post("http://localhost:5000/new",data)
    .then(()=>{
      console.log("Updating the list ...")
      //after POST, GET the updated app list
      axios
        .get("http://localhost:5000/all")
        .then(response => setApps(response.data));
      
      //setVisible(false);  //close the dialog
    })
    .catch(function(error){
      if (error.response){
        console.log(error.response.data);
        console.log(error.response.status);//500
        //console.log(error.response.headers);
        alert("Failed to create new APP\nERROR:"+error.response.status)
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
    })
  };
  
  const onEdit = (values) => {
    console.log('Received values of form: ', values);

    var data = new FormData();
    data.append('app_ID',editVal.app_ID)
    data.append('app_name',values.app_name)
    data.append('description',values.description)

    //POST the form data (UPDATE)
    axios
    .post("http://localhost:5000/update",data)
    .then(()=>{
      console.log("Updating the list ...")
      //after POST, GET the updated app list
      axios
        .get("http://localhost:5000/all")
        .then(response => setApps(response.data));
      
      setEditVisible(false);  //close the dialog
    })
    .catch(function(error){
      if (error.response){
        console.log(error.response.data);
        console.log(error.response.status);//500
        //console.log(error.response.headers);
        alert("Failed to create new APP\nERROR CODE:"+error.response.status)
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
    })
  };

  //when the delete dialog is confirmed
  const onDelete = (values) => {
    console.log("HERE",values);
    var data = new FormData();
    data.append('app_ID',values.app_ID)
    
    //POST delete request
    axios
    .post("http://localhost:5000/delete",data)
    .then(response => {console.log("Deleted App:", values)})
    .then(()=>{
      console.log("Updating the list ...")
      //refresh app list
      axios
        .get("http://localhost:5000/all")
        .then(response => setApps(response.data))
    })

    setVisible2(false)
  }

  const columns = React.useMemo(()=> [
    {
      Header: 'ID',
      accessor: 'app_ID'
    },
    {
      Header: 'Name',
      accessor: 'app_name'
    },
    {
      Header: 'Description',
      accessor: 'description'
    },
    {
      Header: 'Actions',
      accessor: 'actions'
    }],
    []);

  //retrieve and set SQL data to 'apps' (initialization)
  useEffect(() => {
      axios
        .get("http://localhost:5000/all")
        .then(response => setApps(response.data))
  }, []);

  //HANDLE EDIT
  const handleA = (values) => {
    console.log('Action A (EDIT) from', values);
    setEditVal(values);
    setEditVisible(true);//open edit window
  }

  //HANDLE DELETE BUTTON CLICK
  const handleB = (values) => {
    console.log('Action B (DELETE) from', values);
    setDeleteVal(values);
    setVisible2(true);//open confirm window
  }

  return (
    <div className='App'>
      <Button type = "primary" onClick={()=>{setVisible(true);}}>Add</Button>
      
      <CreateStepForm 
      visible={visible}
      onCreate={onCreate}
      onCancel={()=>{setVisible(false)}}
      />

      <DeleteDialog
      visible={visible2}
      onDelete={onDelete}
      onCancel={()=>{setVisible2(false)}}
      values={deleteVal}
      />

      <EditDialog
      visible={editVisible}
      onEdit = {onEdit}
      onCancel={()=>{
        setEditVisible(false)}}
      values={editVal}
      />

      <AppTable 
      columns={columns} 
      rows={apps}
      handleA = {handleA}
      handleB = {handleB}
      />
    </div>
    
  );
}

export default App;
