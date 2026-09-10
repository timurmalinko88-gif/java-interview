package com.example.assistant.client;

@FunctionalInterface
public interface Sleeper {
    void sleep(long millis) throws InterruptedException;

    Sleeper DEFAULT = Thread::sleep;
}
