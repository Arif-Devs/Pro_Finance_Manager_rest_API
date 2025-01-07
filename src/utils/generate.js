// generate slug
const generateSlug = (title) => {
  return title.trim().toLowerCase().replace(' ', '-')
}

export default generateSlug
