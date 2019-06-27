const express = require('express')
const router = express.Router()
const multer = require('multer')
const csv = require('fast-csv')
const fs = require('fs')

const catchException = require('../middlewares/catchException')
const EmployeeModel = require('../models/employee')
const EmployeeService = require('../services/employee')
const { validateCsvInput } = require('../validation/employees')

const dir = './src/uploads'
// const dir = './uploads'
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './src/uploads')
    // cb(null, './uploads')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({
  storage: storage,
})

router.post(
  '/import-csv',
  upload.single('file'),
  catchException(async (req, res) => {
    // res.send({ file: req.file })
    if (!req.file) {
      return res.status(400).json('No Files were uploaded.')
    }

    const originalName = req.file.originalname

    // fs.createReadStream(`./src/uploads/2019-06-27T09:20:05.082ZReport_Of_Daily_Trips_2019-03-10_2019-04-08_356525090016102.csv`)
    //   .pipe(csv())
    //   .on('data', row => {
    //     console.log(row)
    //   })
    //   .on('end', () => {
    //     console.log('CSV file successfully processed')
    //   })

    // csv.fromString(req.file.data.toString())

    const employees = []

    // fs.createReadStream(`./src/uploads/${originalName}`)
    fs.createReadStream(`./src/uploads/${originalName}`)
      .pipe(csv.parse({ headers: true }))
      .on('data', row => {
        const changeData = {
          fullName: row['Full Name'],
          dob: row['Date of Birth'],
          gender: row.gender,
          salary: row.salary,
          designation: row.designation,
        }

        employees.push(changeData)
      })
      .on('end', async function() {
        const employeeServiceInstance = new EmployeeService(EmployeeModel)
        const { createdEmployees } = await employeeServiceInstance.importCsv(
          employees
        )
        res.status(200).json({ totalCreated: createdEmployees })

        // employees.map(employee => {
        //     const { error } = validateCsvInput(employee)
        //     if (error) return res.status(400).json(error.details[0].message)
        // })
        // res.send({employees})
      })
  })
)

router.get(
  '/:created?',
  catchException(async (req, res) => {
    const employeeServiceInstance = new EmployeeService(EmployeeModel)
    const employees = await employeeServiceInstance.getEmployees(
      req.params.created
    )
    res.status(200).json({ employees })
  })
)

module.exports = router
