<template>
  <div class="login-form">
    <form v-on:submit.prevent>
      <h2 class="text-center">Log in</h2>
      <div class="form-group">
        <input
          type="text"
          class="form-control"
          placeholder="Email"
          required="required"
          v-model="email"
        />
      </div>
      <div class="form-group">
        <input
          type="password"
          class="form-control"
          placeholder="Password"
          required="required"
          v-model="password"
        />
      </div>
      <div class="form-group">
        <button @click="submit" class="btn btn-primary btn-block">Log in</button>
      </div>
      <div class="clearfix">
        <router-link to="/register">Create an Account</router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  created(){
    /* check whether the user is aready logged in */
    const jwtAuthToken = localStorage.getItem('jwtToken')
		if (jwtAuthToken) {
      this.$router.push('/home')
    } else {
			this.$router.push('/login')
		}	
	},
  methods: {
    submit() {
			if (!this.email || !this.password) {
				// TODO: show error in UI
				return
			}
      
      const payload = {
        email: this.email,
        password: this.password,
      }

			this.axios
				.post(`${this.BASE_URL}/api/v1/users/login`, { payload })
				.then(res => {
          localStorage.setItem('jwtToken', res.data.token)
          this.$router.push({ name: 'home' })
				})
				.catch(err => {
          // TODO: show error UI
          console.log(err.response.data.message)
				})
		},
  }
}
</script>

<style>
.login-form {
  width: 340px;
  margin: 50px auto;
}
.login-form form {
  margin-bottom: 15px;
  background: #f7f7f7;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  padding: 30px;
}
.login-form h2 {
  margin: 0 0 15px;
}
.form-control,
.btn {
  min-height: 38px;
  border-radius: 2px;
}
.btn {
  font-size: 15px;
  font-weight: bold;
}
</style>
