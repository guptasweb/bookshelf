class CreateBooks < ActiveRecord::Migration[7.0]
  def change
    create_table :books do |t|
      # Google Books API fields
      t.string :google_books_id, unique: true
      t.string :title, null: false
      t.string :subtitle
      t.text :authors
      t.string :publisher
      t.date :published_date
      t.text :description
      t.integer :page_count
      t.text :categories
      t.string :language, default: 'en'
      
      # ISBN fields
      t.string :isbn_10
      t.string :isbn_13
      
      # Image URLs from Google Books
      t.string :thumbnail
      t.string :small_thumbnail
      t.string :large_thumbnail
      
      # Links
      t.string :preview_link
      t.string :info_link
      
      # Local fields
      t.decimal :average_rating, precision: 3, scale: 2, default: 0
      t.integer :reviews_count, default: 0
      t.boolean :featured, default: false
      
      t.timestamps
    end
    
    add_index :books, :google_books_id, unique: true
    add_index :books, :isbn_10, unique: true
    add_index :books, :isbn_13, unique: true
    add_index :books, :title
    add_index :books, :published_date
    add_index :books, :average_rating
    add_index :books, :featured
  end
end 