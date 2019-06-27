class AuthService {
  constructor(EmployeeModel) {
    this.EmployeeModel = EmployeeModel
  }

  async importCsv(employees) {
    if (!employees.length) {
      const error = new Error('Nothing to import')
      error.statusCode = 400
      throw error
    }

    const employeesCreate = await this.EmployeeModel.create(employees)

    return {
      createdEmployees: employeesCreate.length,
    }
  }

  async getEmployees(data) {
    let query = {}
    console.log('data', data)
    if (data) {
      query = {
        created: { $gte: data },
      }
    }
    return this.EmployeeModel.find(query)
  }
}

module.exports = AuthService
