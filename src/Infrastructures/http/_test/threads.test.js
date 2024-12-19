const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const fakerThreadPayload = {
        title: 'a thread title',
        body: 'some thread body',
      };
      await UsersTableTestHelper.addUser({});
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: fakerThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const fakerThreadPayload = {
        title: 'a thread title',
      };
      await UsersTableTestHelper.addUser({});
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: fakerThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload has wrong data type', async () => {
      // Arrange
      const fakerThreadPayload = {
        title: 'a thread title',
        body: 123,
      };
      await UsersTableTestHelper.addUser({});
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: fakerThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena terdapat properti dengan tipe data tidak sesuai');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread detail', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', userId: 'user-123' });
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toBeInstanceOf(Array);
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].replies).toBeInstanceOf(Array);
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan di database');
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted new comment on existing thread', async () => {
      // Arrange
      const fakerCommentPayload = {
        content: 'some comment content',
      };
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: fakerCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const fakerCommentPayload = {};
      await UsersTableTestHelper.addUser({});
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: fakerCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload has wrong data type', async () => {
      // Arrange
      const fakerCommentPayload = {
        content: 123,
      };
      await UsersTableTestHelper.addUser({});
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: fakerCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena terdapat properti dengan tipe data tidak sesuai');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const fakerCommentPayload = {
        content: 'some comment content',
      };
      await UsersTableTestHelper.addUser({});
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: fakerCommentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan di database');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and delete comment on existing thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 when user is not comment owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'user-234' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ userId: 'user-234' });

      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar ini bukan milik anda');
    });

    it('should response 404 when thread/comment not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-234', userId: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-234', threadId: 'thread-234', userId: 'user-123' });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan di database');
    });
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and toggle comment likes on existing thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted new reply on existing comment', async () => {
      // Arrange
      const fakerReplyPayload = {
        content: 'some reply content',
      };
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: fakerReplyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const fakerReplyPayload = {};
      await UsersTableTestHelper.addUser({});
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: fakerReplyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload has wrong data type', async () => {
      // Arrange
      const fakerReplyPayload = {
        content: 123,
      };
      await UsersTableTestHelper.addUser({});
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: fakerReplyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena terdapat properti dengan tipe data tidak sesuai');
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const fakerReplyPayload = {
        content: 'some reply content',
      };
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: fakerReplyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan di database');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and delete reply on existing thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', userId: 'user-123' });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 when user is not comment owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'user-234' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', userId: 'user-234' });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('balasan komentar ini bukan milik anda');
    });

    it('should response 404 when thread/comment not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-234', threadId: 'thread-123', userId: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-234', commentId: 'comment-234', userId: 'user-123' });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('balasan komentar tidak ditemukan di database');
    });
  });
});
