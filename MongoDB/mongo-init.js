db.createUser(
        {
            user: "admin",
            pwd: "admin",
            roles: [
                {
                    role: "readWrite",
                    db: "Witventory"
                }
            ]
        }
);

use Witventory

db.createCollection("item")

db.item.insert({"name": "test"})