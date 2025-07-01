<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MenuItemController extends Controller
{
    public function index()
    {
        return MenuItem::orderBy('category')->orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'is_available' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menu_items', 'public_uploads');
            $validatedData['image_url'] = asset('uploads/' . $path);
        }

        $menuItem = MenuItem::create($validatedData);
        return response()->json($menuItem, 201);
    }

    public function show(MenuItem $menuItem)
    {
        return response()->json($menuItem);
    }

    public function updateWithImage(Request $request, MenuItem $menuItem)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'is_available' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {
            if ($menuItem->image_url) {
                $oldPath = str_replace(config('app.url').'/uploads/', '', $menuItem->image_url);
                Storage::disk('public_uploads')->delete($oldPath);
            }
            $path = $request->file('image')->store('menu_items', 'public_uploads');
            $validatedData['image_url'] = asset('uploads/' . $path);
        }

        $menuItem->update($validatedData);
        return response()->json($menuItem);
    }

    public function destroy(MenuItem $menuItem)
    {
        if ($menuItem->image_url) {
            $oldPath = str_replace(config('app.url').'/uploads/', '', $menuItem->image_url);
            Storage::disk('public_uploads')->delete($oldPath);
        }
        $menuItem->delete();
        return response()->noContent();
    }
}