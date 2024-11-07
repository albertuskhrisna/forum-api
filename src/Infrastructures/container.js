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
const IAuthenticationRepository = require('../Domains/authentications/IAuthenticationRepository');
const IAuthenticationTokenManager = require('../Applications/security/IAuthenticationTokenManager');
const IThreadRepository = require('../Domains/threads/IThreadRepository');
const ICommentRepository = require('../Domains/comments/ICommentRepository');
const IReplyRepository = require('../Domains/replies/IReplyRepository');

/* service concrete (repository, helper, manager, etc) */
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPassowrdHash = require('./security/BcryptPasswordHash');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const JwtTokenManager = require('./security/JwtTokenManager');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('./repository/ReplyRepositoryPostgres');

/* use cases */
const AddUserUseCase = require('../Applications/useCases/AddUserUseCase');
const LoginUserUseCase = require('../Applications/useCases/LoginUserUseCase');
const RefreshTokenUseCase = require('../Applications/useCases/RefreshTokenUseCase');
const LogoutUserUseCase = require('../Applications/useCases/LogoutUserUseCase');
const AddThreadUseCase = require('../Applications/useCases/AddThreadUseCase');
const AddCommentUseCase = require('../Applications/useCases/AddCommentUseCase');
const DeleteCommentUseCase = require('../Applications/useCases/DeleteCommentUseCase');
const GetThreadDetailUseCase = require('../Applications/useCases/GetThreadDetailUseCase');
const AddReplyUseCase = require('../Applications/useCases/AddReplyUseCase');
const DeleteReplyUseCase = require('../Applications/useCases/DeleteReplyUseCase');

/* create container */
const container = createContainer();

/* registering service and repository */
container.register([
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
    key: IThreadRepository.name,
    Class: ThreadRepositoryPostgres,
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
    key: ICommentRepository.name,
    Class: CommentRepositoryPostgres,
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
    key: IReplyRepository.name,
    Class: ReplyRepositoryPostgres,
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
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: IThreadRepository.name,
        },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: IThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: ICommentRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: ICommentRepository.name,
        },
      ],
    },
  },
  {
    key: GetThreadDetailUseCase.name,
    Class: GetThreadDetailUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: IThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: ICommentRepository.name,
        },
        {
          name: 'replyRepository',
          internal: IReplyRepository.name,
        },
      ],
    },
  },
  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: ICommentRepository.name,
        },
        {
          name: 'replyRepository',
          internal: IReplyRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: ICommentRepository.name,
        },
        {
          name: 'replyRepository',
          internal: IReplyRepository.name,
        },
      ],
    },
  },
]);

module.exports = container;
