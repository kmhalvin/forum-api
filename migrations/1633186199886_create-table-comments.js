/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    replied_to: {
      type: 'VARCHAR(50)',
      notNull: false,
      default: null,
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
  });

  pgm.addConstraint('comments', '', {
    foreignKeys: [
      {
        columns: 'owner',
        referencesConstraintName: 'fk_comments.id_users.owner_comments',
        references: 'users(id)',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        columns: 'thread_id',
        referencesConstraintName: 'fk_comments.owner_threads.thread_id_comments',
        references: 'threads(id)',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        columns: 'replied_to',
        referencesConstraintName: 'fk_comments.id_comments.replied_to_comments',
        references: 'comments(id)',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
