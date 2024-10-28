/* istanbul ignore file */

const { createContainer } = require('instances-container');

/* external agency */
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

/* service interface (repository, helper, manager, etc) */
const IUserRepository = require('../Domains/users/IUserRepository');
const IPasswordHash = require('../Applications/security/IPasswordHash');
const IAuthenticationRepository = require('../Domains/authentication/IAuthenticationRepository');
const IAuthenticationTokenManager = require('../Applications/security/IAuthenticationTokenManager');

/* service concrete (repository, helper, manager, etc) */
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPassowrdHash = require('./security/BcryptPasswordHash');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const JwtTokenManager = require('./security/JwtTokenManager');

/* use cases */
const AddUserUseCase = require('../Applications/useCases/AddUserUseCase');
const LoginUserUseCase = require('../Applications/useCases/LoginUserUseCase');
const RefreshTokenUseCase = require('../Applications/useCases/RefreshTokenUseCase');
const LogoutUserUseCase = require('../Applications/useCases/LogoutUserUseCase');

/* create container */
const container = createContainer();

/* registering service and repository */
container.register([
  {
    key: IUserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: IPasswordHash.name,
    Class: BcryptPassowrdHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: IAuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: IAuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
]);

/* registering use case */
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: IUserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: IPasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: IUserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: IAuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: IAuthenticationTokenManager.name,
        },
        {
          name: 'passwordHash',
          internal: IPasswordHash.name,
        },
      ],
    },
  },
  {
    key: RefreshTokenUseCase.name,
    Class: RefreshTokenUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: IAuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: IAuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: IAuthenticationRepository.name,
        },
      ],
    },
  },
]);

module.exports = container;
