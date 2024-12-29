<script setup lang="ts">
import { Button } from '@/components/ui/button';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { BellRing, Check } from 'lucide-vue-next';

const notifications = [
    {
        title: 'Your call has been confirmed.',
        description: '1 hour ago',
    },
    {
        title: 'You have a new message!',
        description: '1 hour ago',
    },
    {
        title: 'Your subscription is expiring soon!',
        description: '2 hours ago',
    },
];

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { vAutoAnimate } from '@formkit/auto-animate/vue';

import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { h } from 'vue';
import * as z from 'zod';

const formSchema = toTypedSchema(
    z.object({
        username: z.string().min(2).max(50),
    })
);

const { handleSubmit } = useForm({
    validationSchema: formSchema,
});

const onSubmit = handleSubmit((values) => {
    toast({
        title: 'You submitted the following values:',
        description: h(
            'pre',
            { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
            h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))
        ),
    });
});
</script>
<template>
    <div class="flex flex-col items-center justify-center h-full space-y-6">
        <h1 class="">Welcome to the homepage</h1>
        <div class="flex space-x-4">
            <Button class="" variant="outline">Hello world!</Button>
            <Button class="">Hello world!</Button>
            <Button class="" variant="secondary">Hello world!</Button>
        </div>
        <form class="w-2/3 space-y-6" @submit="onSubmit">
            <FormField v-slot="{ componentField }" name="username">
                <FormItem v-auto-animate>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="shadcn" v-bind="componentField" />
                    </FormControl>
                    <FormDescription> This is your public display name. </FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>
            <Button type="submit"> Submit </Button>
        </form>
        <Card :class="cn('w-[380px] ', $attrs.class ?? '')">
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>You have 3 unread messages.</CardDescription>
            </CardHeader>
            <CardContent class="grid gap-4">
                <div class="flex items-center p-4 space-x-4 border rounded-md">
                    <BellRing />
                    <div class="flex-1 space-y-1">
                        <p class="text-sm font-medium leading-none">Push Notifications</p>
                        <p class="text-sm text-muted-foreground">Send notifications to device.</p>
                    </div>
                    <Switch />
                </div>
                <div>
                    <div
                        v-for="(notification, index) in notifications"
                        :key="index"
                        class="mb-4 grid grid-cols-[25px_minmax(0,1fr)] items-start pb-4 last:mb-0 last:pb-0">
                        <span class="flex w-2 h-2 translate-y-1 rounded-full bg-sky-500" />
                        <div class="space-y-1">
                            <p class="text-sm font-medium leading-none">
                                {{ notification.title }}
                            </p>
                            <p class="text-sm text-muted-foreground">
                                {{ notification.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button class="w-full"> <Check class="w-4 h-4 mr-2" /> Mark all as read </Button>
            </CardFooter>
        </Card>
    </div>
</template>
