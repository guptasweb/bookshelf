class CreateReviews < ActiveRecord::Migration[7.0]
  def change
    create_table :reviews do |t|
      t.references :user, null: false, foreign_key: true
      t.references :book, null: false, foreign_key: true
      t.integer :rating, null: false
      t.text :content
      t.integer :helpful_count, default: 0
      t.boolean :spoiler_alert, default: false
      t.boolean :featured, default: false
      
      t.timestamps
    end
    
    add_index :reviews, [:user_id, :book_id], unique: true
    add_index :reviews, :rating
    add_index :reviews, :helpful_count
    add_index :reviews, :featured
    add_index :reviews, :created_at
  end
end 