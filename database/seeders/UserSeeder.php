<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = User::factory()->create(['email' => 'admin@admin.com']);
        $admin->roles()->attach(1);

        $editor = User::factory()->create();
        $editor->roles()->attach(2);
    }
}
