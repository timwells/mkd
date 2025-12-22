<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Log in</h1>

    <!--p class="text-base mb-4 leading-5">
      New to Vuestic?
      <RouterLink :to="{ name: 'signup' }" class="font-semibold text-primary">Sign up</RouterLink>
    </p-->

    <VaAlert v-if="error" color="danger" class="mb-4" closeable @close="error = ''">
      {{ error }}
    </VaAlert>

    <VaInput
      v-model="formData.email"
      :rules="[validators.required, validators.email]"
      class="mb-4"
      label="Email"
      type="email"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :rules="[validators.required]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>

    <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <VaCheckbox v-model="formData.keepLoggedIn" class="mb-2 sm:mb-0" label="Keep me signed in on this device" />
      <!--RouterLink :to="{ name: 'recover-password' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
        Forgot password?
      </RouterLink-->
    </div>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit">Login</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vuestic-ui'
import { validators } from '../../services/utils'
import { useAuthStore } from '@/stores/auth'

const { validate } = useForm('form')
const { push } = useRouter()
const error = ref('')

const formData = reactive({
  email: '',
  password: '',
  keepLoggedIn: true,
})

const authStore = useAuthStore()

const submit = async () => {
  if (validate()) {
    error.value = ''
    console.log('Logging in with', formData.email, formData.password, formData.keepLoggedIn)
    try {
      await authStore.signIn(formData.email, formData.password, formData.keepLoggedIn)
      push({ name: 'dashboard' })
    } catch (err: any) {
      error.value = 'Login failed. Please check your credentials.'
      // console.error('Login failed:', error.value)
    }
  }
}
</script>
