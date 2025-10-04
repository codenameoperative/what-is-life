import('./src/utils/items/index.ts').then(module => {
  console.log('Items count:', Object.keys(module.items).length)
})
