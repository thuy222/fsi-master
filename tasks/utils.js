const assert = require('assert')
const path = require('path')
const execa = require('execa')
const chalk = require('chalk')
const symbols = require('log-symbols')
const CloudFront = require('aws-sdk/clients/cloudfront')
const STS = require('aws-sdk/clients/sts')
const { v4: uuid } = require('uuid')

const root = path.join(__dirname, '..')

exports.dir = {
  root,
  out: path.join(root, 'build'),
  pkg: path.join(root, 'packages')
}

exports.logWorkspace = environment => {
  console.log(
    `${symbols.info} <${chalk.blue('env')}: ${chalk.red(environment)}>\n`,
    '----------------------------------------------------------------------'
  )
  if (!environment) {
    console.error(`${symbols.error} unknown workspace <env: ${environment}>`)
    process.exit(1)
  }
}

const aws = {
  cloudfront: new CloudFront({ apiVersion: '2019-03-26' })
}

exports.exec = (cmd, args, options = {}) =>
  execa.sync(cmd, args, Object.assign({}, options, { stdio: [0, 1, 2] }))

/**
 * AWS Client
 */
aws.getAccountId = async () => {
  const sts = new STS()
  return new Promise((resolve, reject) => {
    sts.getCallerIdentity({}, (err, data) => {
      err ? reject(err) : resolve(data.Account)
    })
  })
}

aws.listDistributions = async () => {
  return new Promise((resolve, reject) => {
    aws.cloudfront.listDistributions({}, (err, data) => {
      err ? reject(err) : resolve(data.Items)
    })
  })
}

aws.getDistributionByDomain = async domain => {
  const items = await aws.listDistributions()
  const [distribution] = items.filter(
    item => item.Aliases.Quantity === 1 && item.Aliases.Items[0] === domain
  )
  assert.strictEqual(
    distribution !== undefined,
    true,
    `<domain: ${domain}> is not valid`
  )
  return distribution
}

aws.getDistributionConfig = Id => {
  return new Promise((resolve, reject) => {
    aws.cloudfront.getDistributionConfig({ Id }, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

aws.updateDistribution = params => {
  return new Promise((resolve, reject) => {
    aws.cloudfront.updateDistribution(params, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

/**
 * Update `origin path` (aka version) in specified CDN via its Id.
 * @param {String} Id - Id of the CDN.
 * @param {String} originPath - version folder starts with `/`.
 */
aws.updateOriginPath = async (Id, originPath) => {
  const config = await aws.getDistributionConfig(Id)
  config.Id = Id
  config.DistributionConfig.Origins.Items = config.DistributionConfig.Origins.Items.map(
    item => {
      item.OriginPath = originPath
      return item
    }
  )
  config.IfMatch = config.ETag
  delete config.ETag
  await aws.updateDistribution(config)
  await aws.createInvalidation(Id)
}

/**
 * Create a new invalidation on CloudFront to activate newly deployed assets.
 * @param {String} DistributionId - unique distribution id of cloudfront.
 */
aws.createInvalidation = async DistributionId => {
  const params = {
    DistributionId,
    InvalidationBatch: {
      CallerReference: uuid(),
      Paths: {
        Quantity: 1,
        Items: ['/*']
      }
    }
  }
  console.log(
    `<distribution: ${DistributionId}> start invalidating existing assets ...`
  )
  return new Promise((resolve, reject) => {
    aws.cloudfront.createInvalidation(params, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

exports.aws = aws
