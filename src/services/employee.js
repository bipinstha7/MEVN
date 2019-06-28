const clone = require('lodash/clone')
const fs = require('fs')

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

  async getEmployees(req) {
    let query = {}

    if (req.query.imported) {
      query = {
        imported: { $gte: req.query.imported },
      }
    }

    let sort = {}
    const sortBy = req.query.sort
    if (sortBy) {
      sort = {
        [sortBy]: 1,
      }
    }

    let resultQuery = this.EmployeeModel.find(query)
    let countQuery = clone(resultQuery)

    const count = await countQuery.sort(sort).countDocuments()

    const result = await resultQuery
      .skip(parseInt(req.params.perPage) * (req.params.pageNo - 1))
      .limit(parseInt(req.params.perPage))

    return {
      employees: result,
      total: count,
    }
  }

  async create(payload) {
    await this.EmployeeModel.create(payload)

    return {
      success: true,
    }
  }

  async getEmployee(id) {
    return await this.EmployeeModel.findById(id)
  }

  async edit(id, payload) {
    await this.EmployeeModel.findByIdAndUpdate(id, payload)

    return {
      success: true,
    }
  }

  async download(payload, res) {
    const employees = await this.EmployeeModel.find({ _id: payload.employeeId })

    if (employees.length) {
      let documentName = `Report Of Employees`
      documentName = documentName.split(' ').join('_')

      // create 'reports' folder if it does not exist
      const dir = './client/public/reports'
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }

      if (payload.pdfORcsv === 'pdf') {
        // check if file already exists or not
        const path = `./client/public/reports/pdfs/${documentName}.pdf`

        try {
          // create 'pdfs' folder if it does not exist
          const dir = './client/public/reports/pdfs'
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
          }

          if (fs.existsSync(path)) {
            res.send({ url: `/reports/pdfs/${documentName}.pdf` })

            // delete pdf or csv file
            // fs.unlink(`./public/reports/pdfs/${documentName}.pdf`, (err) => {
            // 	if (err) {
            // 		console.log('can not delete the file, something happened')
            // 	} else {
            // 		console.log(`${documentName}.pdf was deleted`);
            // 	}
            // })
          } else {
            function buildTableBody() {
              // table header
              let header = [
                { text: 'Full Name', style: 'tableHeader' },
                { text: 'Gender', style: 'tableHeader' },
                { text: 'Salary', style: 'tableHeader' },
                { text: 'Designation', style: 'tableHeader' },
                { text: 'Date of Birth', style: 'tableHeader' },
              ]

              let body = []

              body.push(header)
              employees.forEach(employee => {
                let dob = employee.dob.toISOString().substring(0, 10)

                console.log('dob', dob)

                let data = []

                data.push({ text: employee.fullName, style: 'tableBody' })
                data.push({ text: employee.gender, style: 'tableBody' })
                data.push({ text: employee.salary, style: 'tableBody' })
                data.push({ text: employee.designation, style: 'tableBody' })
                data.push({ text: dob, style: 'tableBody' })

                body.push(data)
              })
              return body
            }

            // pdf file to download
            let employeePdf = {
              pageOrientation: 'landscape',
              content: [
                { text: 'Report of Employees', style: 'header' },
                {
                  style: 'tableExample',
                  table: {
                    headerRows: 1,
                    body: buildTableBody(),
                  },
                },
              ],
              styles: {
                header: {
                  fontSize: 16,
                  bold: true,
                  font: 'Roboto',
                  margin: [0, 0, 0, 5],
                },
                subheader: {
                  fontSize: 12,
                  bold: true,
                  font: 'Roboto',
                  margin: [1, 0, 0, 1],
                },
                tableExample: {
                  margin: [0, 5, 0, 15],
                },
                tableHeader: {
                  fontSize: 12,
                  bold: true,
                  font: 'Roboto',
                  color: 'black',
                },
                tableBody: {
                  fontSize: 10,
                },
              },
            }

            let fontDescriptors = {
              Roboto: {
                normal: './src/font/Roboto-Regular.ttf',
                bold: './src/font/Roboto-Medium.ttf',
                italics: './src/font/Roboto-Italic.ttf',
                bolditalics: './src/font/Roboto-MediumItalic.ttf',
              },
            }

            const pdfMakePrinter = require('pdfmake/src/printer')
            const printer = new pdfMakePrinter(fontDescriptors)

            let doc = printer.createPdfKitDocument(employeePdf)
            let writeStream = null
            doc.pipe(
              (writeStream = fs.createWriteStream(
                `./client/public/reports/pdfs/${documentName}.pdf`
              ))
            )
            doc.end()

            writeStream.on('finish', async function() {
              // res.redirect(`/pdfs/${documentName}.pdf`)
              res.send({
                url: `/reports/pdfs/${documentName}.pdf`,
              })
            })
          }
        } catch (err) {
          console.error('error on checking if the pdf file exists', err)
        }
      } else if (payload.pdfORcsv === 'csv') {
        // download csv

        const path = `./client/public/reports/csvs/${documentName}.csv`

        // check if file already exists or not
        try {
          // create 'csvs' folder if it does not exist
          const dir = './client/public/reports/csvs'
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
          }

          if (fs.existsSync(path)) {
            //console.log('csv file exists - DOT')
            res.send({ url: `/reports/csvs/${documentName}.csv` })
          } else {
            //console.log('csv file not exits - DOT')

            function objectToCsv(data) {
              const csvRows = []

              const headers = Object.keys(data[0])
              csvRows.push(`Report Of Employees \n`)

              csvRows.push(headers.join(','))

              for (const row of data) {
                const values = headers.map(header => {
                  // we might need to handle if it contains a quote
                  // then Wrap with quotes
                  // handles the comma in coordinates
                  return '"' + row[header] + '"'
                })
                csvRows.push(values.join(','))
              }
              //join each array with the next line
              return csvRows.join('\n')
            }

            const objectData = employees.map(employee => {
              let dob = employee.dob.toISOString().substring(0, 10)

              return {
                'Full Name': employee.fullName,
                Gender: employee.gender,
                Salary: employee.salary,
                Designation: employee.designation,
                'Date of Birth': dob,
              }
            })

            const csvData = objectToCsv(objectData)

            fs.writeFile(
              `./client/public/reports/csvs/${documentName}.csv`,
              csvData,
              'utf8',
              function(err) {
                if (err) {
                  console.log('error', err)
                }
                res.send({
                  url: `/reports/csvs/${documentName}.csv`,
                })
              }
            )
          }
        } catch (err) {
          next(err)
          // console.error('error on checking if the csv file exists', err)
        }
      }
    } else {
      // res.send({
      //   result: trips,
      //   total: 0,
      // })
    }
  }
}

module.exports = AuthService
