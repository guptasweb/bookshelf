class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
      t.text :bio
      t.string :location
      t.string :website
      t.boolean :active, default: true
      t.boolean :email_notifications, default: true
      t.datetime :last_sign_in_at
      
      t.timestamps
    end
    
    add_index :users, :email, unique: true
    add_index :users, :active
  end
end 