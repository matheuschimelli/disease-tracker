import jwt from 'jsonwebtoken'

export function checkAuthorization (token) {
  return new Promise(async (resolve, reject) => {
    const authUser = await jwt.verify(token, process.env.SECRET)

    if (authUser) {
      resolve(authUser)
    } else {
      reject("Couldn't authenticate user")
    }
  })
}

export function generateToken (user, secret, expiresIn) {
  const { id, fullName, email } = user

  return jwt.sign({ id, fullName, email }, secret, { expiresIn })
}
