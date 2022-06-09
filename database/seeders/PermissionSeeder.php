<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Permission::create(['name' => 'post_view']);
        Permission::create(['name' => 'post_create']);
        Permission::create(['name' => 'post_update']);
        Permission::create(['name' => 'post_delete']);
    }
}
