<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item active">
          <a
            class="nav-link"
            href="javascript:void(0)"
            @click="logoutAndRedirectToLogin()"
            >Log out</a
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    logoutAndRedirectToLogin() {
      localStorage.removeItem('jwtToken')
      this.$router.replace('/login')
    },
  },
}
</script>

<style></style>
