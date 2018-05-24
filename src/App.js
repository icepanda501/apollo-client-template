import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import React, { Component } from 'react'

import './App.css'

class App extends Component {
  state = {
    createCustomerInput: {
      id: 0,
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      website: '',
    },
  }

  handleChange = (e) => {
    this.setState({
      createCustomerInput: {
        ...this.state.createCustomerInput,
        [e.target.name]: e.target.value,
      },
    })
  }

  async createCustomer() {
    console.log(this.state.createCustomerInput)
    await this.props.createCustomer({ variables: { createCustomerInput: this.state.createCustomerInput } })
    await this.props.refetch()
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <span>FiveBook</span>
        </header>
        <div className="App-body">
          <div className="input-group">

            <span>id</span>
            <input
              className="text-input"
              value={this.state.createCustomerInput.id}
              name="id"
              onChange={e => this.handleChange(e)}
            />

            <span>firstName</span>
            <input
              className="text-input"
              name="firstName"
              onChange={e => this.handleChange(e)}
              value={this.state.createCustomerInput.firstName}
            />

            <span>lastName</span>
            <input
              className="text-input"
              name="lastName"
              onChange={e => this.handleChange(e)}
              value={this.state.createCustomerInput.lastName}
            />

            <span>fullName</span>
            <input
              className="text-input"
              name="fullName"
              onChange={e => this.handleChange(e)}
              value={this.state.createCustomerInput.fullName}
            />

            <span>email</span>
            <input
              className="text-input"
              name="email"
              onChange={e => this.handleChange(e)}
              value={this.state.createCustomerInput.email}
            />

            <span>website</span>
            <input
              className="text-input"
              name="website"
              onChange={e => this.handleChange(e)}
              value={this.state.createCustomerInput.website}
            />

            <button className="button-input" onClick={() => this.createCustomer()}>CREATE</button>
          </div>
          <div className="nameCardGroup">
            {
              this.props.data.customers.map(customer => (
                <div key={customer.id} className="nameCard">
                  {customer.fullName}<br />
                  <div className="smallBlock">
                    CustomerData <br />
                    firstName: {customer.firstName}<br />
                    LastName: {customer.lastName} <br />
                    Email: {customer.email} <br />
                    Website: {customer.website} <br />
                  </div>
                  <div className="smallBlock">
                    {
                      customer.company.map(company => (
                        <div key={company.id}>
                          CompanyData<br />
                          id: {company.id}<br />
                          name: {company.name} <br />
                        </div>
                      ))}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

const getCurrentCustomer = gql`
  query GetCurrentCustomer {
            customers{
          id
          firstName
          lastName
          fullName
          email
          website
          company{
            id
            name
          }
        }
      }
    `

const createCustomer = gql`
  mutation createCustomer($createCustomerInput : CreateCustomerInput){
            createCustomer(createCustomerInput : $createCustomerInput){
              id
              firstName
              lastName
              fullName
              email
              website
                company{
                  id
                  name
                }
              }
          }
        `
const AppBindQuery = () => (
  <Mutation
    mutation={createCustomer}
    update={(cache, { data: { createCustomer } }) => {
      const { customers } = cache.readQuery({ query: getCurrentCustomer })
      console.log('creactCustomer',)
      cache.writeQuery({
        query: getCurrentCustomer,
        data: { customers: customers.concat(createCustomer) },
      })
    }}
  >
    {
      (createCustomer, data) => (
        <Query query={getCurrentCustomer}>
          {
            ({ loading, data, refetch }) => (!loading ? (
              <App data={data} createCustomer={createCustomer} refetch={refetch} />
            ) : null)
          }
        </Query>
      )
    }
  </Mutation>
)

export default AppBindQuery
