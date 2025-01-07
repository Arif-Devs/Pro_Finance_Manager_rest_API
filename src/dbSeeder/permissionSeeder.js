import { PERMISSIONSARRAY } from '../config/auth.js'
import Permission from '../model/permission.js'

const permissionSeeder = async () => {
  try {
    await Permission.deleteMany()
    console.log('permission are being creating....')

    PERMISSIONSARRAY.forEach(async (item) => {
      const permission = new Permission({
        name: item,
      })
      await permission.save()
    })
    console.log('permission created successful!')
  } catch (error) {
    throw error
  }
}

export default permissionSeeder
