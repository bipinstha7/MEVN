<template>
  <div class="login-form">
    <h2 class="text-center">Create New Employee</h2>
    <div class="form-group">
      <input
        type="text"
        class="form-control"
        placeholder="Full Name"
        required="required"
        v-model="fullName"
      />
    </div>
    <div class="form-group">
      <input
        type="text"
        class="form-control"
        placeholder="Gender"
        required="required"
        v-model="gender"
      />
    </div>
    <div class="form-group">
      <input
        type="text"
        class="form-control"
        placeholder="Salary"
        required="required"
        v-model="salary"
      />
    </div>
    <div class="form-group">
      <input
        type="text"
        class="form-control"
        placeholder="Designation"
        required="required"
        v-model="designation"
      />
    </div>
    <div class="form-group">
      <input
        type="date"
        class="form-control"
        placeholder="Date of Birth"
        required="required"
        v-model="dob"
      />
    </div>
    <div class="form-group">
      <input
        type="file"
        name="image"
        ref="file"
        accept="image/*"
        @change="handleImageUpload"
      />
    </div>
    <div>
      <img
        :src="`http://localhost:3000/${imageUrl}`"
        height="150"
        v-if="updateImage && this.imageUrl"
      />
      <img :src="imageUrl" height="150" v-else />
    </div>
    <div class="form-group">
      <button
        @click="edit"
        class="btn btn-primary btn-block"
        v-if="$route.params.id"
      >
        Edit
      </button>
      <button @click="create" class="btn btn-primary btn-block" v-else>
        Create
      </button>
    </div>
    <div class="clearfix">
      <router-link to="/employees">back</router-link>
    </div>
    <div>
      <small v-if="showMessage">{{ showMessage }}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Create',
  data() {
    return {
      fullName: '',
      gender: '',
      salary: '',
      designation: '',
      dob: '',
      image: '',
      imageUrl: '',
      showMessage: '',
      imageData: '',
      updateImage: false,
    }
  },
  created() {
    if (this.$route.params.id) {
      this.updateImage = true
      this.fetchEmployee()
    }
  },
  methods: {
    create() {
      if (
        !this.fullName ||
        !this.gender ||
        !this.salary ||
        !this.designation ||
        !this.dob
      ) {
        // TODO: show error in UI
        return
      }

      const payload = {
        fullName: this.fullName,
        gender: this.gender,
        salary: this.salary,
        designation: this.designation,
        dob: this.dob,
        image: this.image,
      }

      const formData = new FormData()
      for (let key in payload) {
        formData.append(key, payload[key])
      }
      formData.append('file', this.imageData)

      this.axios
        .post(`${this.BASE_URL}/employees`, formData)
        .then(() => {
          this.$router.push({ name: 'employees' })
        })
        .catch(err => {
          // TODO: show error in UI
          console.log(err)
        })
    },
    handleImageUpload() {
      this.updateImage = false
      const file = this.$refs.file.files[0]
      const allowedTypes = ['image/jpeg', 'image/png']

      const tooLarge = file.size > 4000000

      if (tooLarge || !allowedTypes.includes(file.type)) {
        this.showMessage = tooLarge
          ? 'image size should be less than 4mb'
          : 'only image is allowed'
        return
      }

      let fileName = file.name
      this.image = fileName

      if (fileName.lastIndexOf('.') <= 0) {
        return alert('Please add a valid image file')
      }

      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(file)
      this.imageData = file
    },
    fetchEmployee() {
      const id = this.$route.params.id
      let instance = this
      this.axios
        .get(`${this.BASE_URL}/employees/${id}`)
        .then(result => {
          console.log('edit', result)
          if (result.data.employee) {
            const {
              fullName,
              gender,
              salary,
              designation,
              dob,
              image,
            } = result.data.employee
            instance.fullName = fullName
            instance.gender = gender
            instance.salary = salary
            instance.designation = designation
            instance.dob = dob.substring(0, 10)
            instance.imageUrl = image
          }
          instance.loadingData = false
        })
        .catch(err => {
          console.log('Error on fetching data', err)
          instance.error =
            'Error on fetching data. Please check your connection.'
          instance.loadingData = false
        })
    },
    edit() {
      if (
        !this.fullName ||
        !this.gender ||
        !this.salary ||
        !this.designation ||
        !this.dob
      ) {
        // TODO: show error in UI
        return
      }

      const payload = {
        fullName: this.fullName,
        gender: this.gender,
        salary: this.salary,
        designation: this.designation,
        dob: this.dob,
        image: this.image,
      }

      const formData = new FormData()
      for (let key in payload) {
        formData.append(key, payload[key])
      }
      formData.append('file', this.imageData)

      const id = this.$route.params.id
      this.axios
        .put(`${this.BASE_URL}/employees/${id}`, formData)
        .then(() => {
          this.$router.push({ name: 'employees' })
        })
        .catch(err => {
          // TODO: show error UI
          console.log(err)
        })
    },
  },
}
</script>
