class CreateReadingListItems < ActiveRecord::Migration[7.0]
  def change
    create_table :reading_list_items do |t|
      t.references :reading_list, null: false, foreign_key: true
      t.references :book, null: false, foreign_key: true
      t.string :status, default: 'want_to_read'
      t.integer :current_page
      t.text :notes
      t.datetime :started_at
      t.datetime :completed_at
      t.integer :position
      
      t.timestamps
    end
    
    add_index :reading_list_items, [:reading_list_id, :book_id], unique: true
    add_index :reading_list_items, :status
    add_index :reading_list_items, :position
    add_index :reading_list_items, :completed_at
  end
end 