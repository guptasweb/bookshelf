class CreateReadingLists < ActiveRecord::Migration[7.0]
  def change
    create_table :reading_lists do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.boolean :is_public, default: false
      t.integer :books_count, default: 0
      
      t.timestamps
    end
    
    add_index :reading_lists, [:user_id, :name], unique: true
    add_index :reading_lists, :is_public
    add_index :reading_lists, :created_at
  end
end 