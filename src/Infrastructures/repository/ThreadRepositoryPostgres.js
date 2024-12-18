const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
const IThreadRepository = require('../../Domains/threads/IThreadRepository');

class ThreadRepositoryPostgres extends IThreadRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(createThread) {
    const { title, body, owner } = createThread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: `INSERT INTO threads (id, title, body, owner_id)
        VALUES($1, $2, $3, $4) RETURNING id, title, owner_id`,
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);
    const newThread = result.rows[0];
    return new CreatedThread({
      id: newThread.id,
      title: newThread.title,
      owner: newThread.owner_id,
    });
  }

  async checkThreadAvailability(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan di database');
    }
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, users.username,
      TO_CHAR(timezone('UTC', threads.date), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS date
      FROM threads JOIN users ON threads.owner_id = users.id WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan di database');
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
