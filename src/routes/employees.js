const express = require('express')
const router = express.Router()
const multer = require('multer')
const csv = require('fast-csv')
const fs = require('fs')

const catchException = require('../middlewares/catchException')
const EmployeeModel = require('../models/employee')
const EmployeeService = require('../services/employee')
const {
  validateCsvInput,
  validateEmployeeInput,
} = require('../validation/employees')
const checkLogin = require('../middlewares/auth')

const dir = './src/assets/uploads'
// const dir = './uploads'
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './src/assets/uploads')
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
  checkLogin,
  upload.single('file'),
  catchException(async (req, res) => {
    if (!req.file) {
      return res.status(400).json('No Files were uploaded.')
    }

    const originalName = req.file.originalname

    const employees = []

    // fs.createReadStream(`./src/uploads/${originalName}`)
    fs.createReadStream(`./src/assets/uploads/${originalName}`)
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
  '/:id',
  checkLogin,
  catchException(async (req, res) => {
    console.log('dddddddd', req.header('authorization'))
    const employeeServiceInstance = new EmployeeService(EmployeeModel)
    const employee = await employeeServiceInstance.getEmployee(req.params.id)

    res.status(200).json({ employee })
  })
)

router.get(
  '/:perPage?/:pageNo?',
  checkLogin,
  catchException(async (req, res) => {
    const employeeServiceInstance = new EmployeeService(EmployeeModel)
    const { employees, total } = await employeeServiceInstance.getEmployees(req)

    res.status(200).json({ employees, total })
  })
)

const fileFilter = function(req, file, cb) {
  const allowedTypes = ['image/jpeg', 'image/png']

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('wrong file type')
    error.code = 'LIMIT_FILE_TYPES'
    return cb(error, false)
  }

  cb(null, true)
}

const imageDir = './src/assets/images'
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir)
}

const imageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './src/assets/images')
    // cb(null, './uploads')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  },
})

const IMAGE_MAX_SIZE = 4000000
const image = multer({
  storage: imageStorage,
  fileFilter,
  limits: {
    fileSize: IMAGE_MAX_SIZE,
  },
})

router.post(
  '/',
  checkLogin,
  image.single('file'),
  catchException(async (req, res) => {
    const { error } = validateEmployeeInput(req.body.payload)
    if (error) return res.status(400).json(error.details[0].message)

    const payload = {
      fullName: req.body.fullName,
      gender: req.body.gender,
      salary: req.body.salary,
      designation: req.body.designation,
      dob: req.body.dob,
      image: req.body.image,
    }

    const employeeServiceInstance = new EmployeeService(EmployeeModel)
    const { success } = await employeeServiceInstance.create(payload)

    res.status(200).json({ success })
  })
)

router.put(
  '/:id',
  checkLogin,
  image.single('file'),
  catchException(async (req, res) => {
    const { error } = validateEmployeeInput(req.body.payload)
    if (error) return res.status(400).json(error.details[0].message)

    const payload = {
      fullName: req.body.fullName,
      gender: req.body.gender,
      salary: req.body.salary,
      designation: req.body.designation,
      dob: req.body.dob,
      image: req.body.image,
    }

    const employeeServiceInstance = new EmployeeService(EmployeeModel)
    const { success } = await employeeServiceInstance.edit(
      req.params.id,
      payload
    )

    res.status(200).json({ success })
  })
)

router.post(
  '/download',
  checkLogin,
  catchException(async (req, res) => {
    if (!req.body.payload.employeeId.length) {
      return res.status(400).json({ error: 'Id not provided' })
    }
    const employeeServiceInstance = new EmployeeService(EmployeeModel)
    await employeeServiceInstance.download(req.body.payload, res)
  })
)

module.exports = router
