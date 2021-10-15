/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('likes', 'unique_comment_id_and_owner', {
    unique: ['comment_id', 'owner'],
    foreignKeys: [
      {
        columns: 'comment_id',
        referencesConstraintName: 'fk_likes.id_comments.comment_id_likes',
        references: 'comments(id)',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      {
        columns: 'owner',
        referencesConstraintName: 'fk_likes.id_users.owner_likes',
        references: 'users(id)',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    ],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
