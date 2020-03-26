import { Form } from 'antd';
import React, { Component } from 'react';
import classNames from 'classnames';
import LoginContext from './LoginContext';
import LoginItem from './LoginItem';
import LoginSubmit from './LoginSubmit';
import styles from './index.less';

class Login extends Component {
  static Submit = LoginSubmit;

  static defaultProps = {
    className: '',
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      type: props.defaultActiveKey,
      active: {},
    };
    
  }

  componentDidMount() { // chạy sau khi render
    const { form, onCreate } = this.props;
    console.log("onCreate "+onCreate);
    console.log("form"+form);

    if (onCreate) {
      onCreate(form);
    }

  }

  getContext = () => {
    const { form } = this.props;
    return {
      form: { ...form },
      updateActive: activeItem => {
        const { type = '', active = {} } = this.state;

        if (active[type]) {
          active[type].push(activeItem);
        } else {
          active[type] = [activeItem];
        }

        this.setState({
          active,
        });
      },
    };
  };

  handleSubmit = e => {
    e.preventDefault();
    const { active = {}, type = '' } = this.state;
    const { form, onSubmit } = this.props;
    const activeFields = active[type] || []; // null thì trả về mảng

    if (form) {
      form.validateFields(
        activeFields,
        {
          force: true,
        },
        (err, values) => {
          if (onSubmit) {
            onSubmit(err, values);
          }
        },
      );
    }
  };

  render() {
    const { className, children } = this.props;
    return (
      <LoginContext.Provider value={this.getContext()}>
        <div className={classNames(className, styles.login)}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <h1 style={{ marginBottom: 0 }}>Login</h1>
            <div>Enter your Username and Password</div>
          </div>
          <Form onSubmit={this.handleSubmit}>{children}</Form>
        </div>
      </LoginContext.Provider>
    );
  }
}

Object.keys(LoginItem).forEach(item => {
  Login[item] = LoginItem[item];
});
export default Form.create()(Login);
